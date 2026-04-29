//-------- INDEX COM LOGIN E CADASTRO--------
const botaoCadastro = document.getElementById('ir_cadastro');
const botaoLogin = document.getElementById('ir_login');
const painelAuth = document.getElementById('painelAuth');
const overlayEscuro = document.getElementById('overlayEscuro');
const botaoFechar = document.getElementById('fecharAuth');
const formLogin = document.getElementById('formLogin');
const formCadastro = document.getElementById('formCadastro');

function mostrarAba(aba) {
    const alvo = aba === 'login' ? formLogin : formCadastro;
    const outro = aba === 'login' ? formCadastro : formLogin;

    outro.style.display = 'none';
    alvo.style.display = 'flex';

    // Relança a animação de entrada da aba
    alvo.style.animation = 'none';
    alvo.offsetHeight; // força reflow
    alvo.style.animation = '';
}

function abrirPainel(tipo) {
    mostrarAba(tipo);
    overlayEscuro.classList.add('aberto');
    painelAuth.classList.add('aberto');
    document.body.style.overflow = 'hidden';
}

function fecharPainel() {
    painelAuth.classList.remove('aberto');
    overlayEscuro.classList.remove('aberto');
    document.body.style.overflow = '';
}

botaoCadastro.addEventListener('click', () => abrirPainel('login'));
botaoLogin.addEventListener('click', () => abrirPainel('cadastro'));
botaoFechar.addEventListener('click', fecharPainel);
overlayEscuro.addEventListener('click', fecharPainel);

// Troca de aba dentro do painel
document.querySelectorAll('.link_trocar_aba').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarAba(link.dataset.aba);
    });
});
