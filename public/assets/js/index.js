//-------- INDEX COM LOGIN E CADASTRO--------
const botaoCadastro = document.getElementById('ir_cadastro');
const botaoLogin = document.getElementById('ir_login');
const painelAuth = document.getElementById('painelAuth');
const overlayEscuro = document.getElementById('overlayEscuro');
const botaoFechar = document.getElementById('fecharAuth');
const formLogin = document.getElementById('formLogin');
const formCadastro = document.getElementById('formCadastro');
const botaoCadastreseAqui = document.getElementById('cadastreseaqui');
const botaoRealizeoLogin = document.getElementById('realizeologin');


// FUNÇÃO PARA ABRIR O PAINEL de Login ou cadastro
function abrirPainel(tipo) {
    painelAuth.style.display = 'block';
    overlayEscuro.style.display = 'block';

    if (tipo === 'login') {
        formLogin.style.display = 'block';
        formCadastro.style.display = 'none';
    } else if (tipo === 'cadastro') {
        formLogin.style.display = 'none';
        formCadastro.style.display = 'block';
    }
};

// FUNÇÃO PARA FECHAR O PAINEL
function fecharPainel() {
    painelAuth.style.display = 'none';
    overlayEscuro.style.display = 'none';
}


// EVENT LISTENERS - CONECTANDO BOTÕES ÀS FUNÇÕES
botaoCadastro.addEventListener('click', function () {
    abrirPainel('login');
});

botaoLogin.addEventListener('click', function () {
    abrirPainel('cadastro');
});

botaoFechar.addEventListener('click', function () {
    fecharPainel();
});

overlayEscuro.addEventListener('click', function () {
    fecharPainel();
});

botaoCadastreseAqui.addEventListener('click', function () {
    abrirPainel('cadastro');
});

botaoRealizeoLogin.addEventListener('click', function () {
    abrirPainel('login');
});