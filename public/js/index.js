// -------- INDEX: CONTROLE VISUAL DO MODAL DE LOGIN/CADASTRO --------
// Removidos os espaços extras dentro das aspas dos IDs
const botaoCadastro = document.getElementById("ir_cadastro");
const botaoLogin = document.getElementById("ir_login");
const painelAuth = document.getElementById("painelAuth");
const overlayEscuro = document.getElementById("overlayEscuro");
const botaoFechar = document.getElementById("fecharAuth");
const formLogin = document.getElementById("formLogin");
const formCadastro = document.getElementById("formCadastro");
const botaoCadastreseAqui = document.getElementById("cadastreseaqui");
const botaoRealizeoLogin = document.getElementById("realizeologin");

// Ajustado para 180ms para bater com a animação CSS de mobile (0.18s)
const TEMPO_FECHAMENTO_MS = 180; 

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
    
    // Garante que o display esteja block antes de animar
    painelAuth.style.display = "block";
    overlayEscuro.style.display = "block";
    painelAuth.setAttribute("aria-hidden", "false");
    
    // Força o reflow para reiniciar a animação se necessário
    void painelAuth.offsetWidth;

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
    
    // Se já está fechando ou já está escondido, não faz nada
    if (fechandoPainel || getComputedStyle(painelAuth).display === "none") {
        return;
    }

    fechandoPainel = true;
    
    // Adiciona a classe que triggera a animação de SAÍDA no CSS
    painelAuth.classList.add("fechando");
    painelAuth.classList.remove("abrindo");

    // Escuta o fim exato da animação para esconder o elemento
    const handlerFimAnimacao = () => {
        finalizarFechamento();
        painelAuth.removeEventListener("animationend", handlerFimAnimacao);
    };
    
    painelAuth.addEventListener("animationend", handlerFimAnimacao);

    // Fallback de segurança caso o evento animationend falhe
    timeoutFechamento = setTimeout(finalizarFechamento, TEMPO_FECHAMENTO_MS + 50);
}

function finalizarFechamento() {
    if (!fechandoPainel) {
        return;
    }

    if (timeoutFechamento) {
        clearTimeout(timeoutFechamento);
        timeoutFechamento = null;
    }

    // Esconde o elemento apenas após a animação terminar
    painelAuth.style.display = "none";
    overlayEscuro.style.display = "none";
    painelAuth.setAttribute("aria-hidden", "true");
    
    // Limpa estados
    painelAuth.classList.remove("fechando");
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
    botaoFechar.addEventListener("touchstart", fecharPainel, { passive: false });
}

if (overlayEscuro) {
    overlayEscuro.addEventListener("click", fecharPainel);
    overlayEscuro.addEventListener("touchstart", fecharPainel, { passive: false });
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