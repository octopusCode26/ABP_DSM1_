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
    painelAuth.setAttribute('aria-hidden', 'false');

    if (tipo === 'login') {
        formLogin.style.display = 'flex';
        formCadastro.style.display = 'none';
    } else if (tipo === 'cadastro') {
        formLogin.style.display = 'none';
        formCadastro.style.display = 'flex';
    }
};

// FUNÇÃO PARA FECHAR O PAINEL
function fecharPainel() {
    painelAuth.classList.add('fechando');

    painelAuth.addEventListener('animationend', function handler() {
        painelAuth.style.display = 'none';
        overlayEscuro.style.display = 'none';
        painelAuth.setAttribute('aria-hidden', 'true');

        painelAuth.classList.remove('fechando');
        painelAuth.removeEventListener('animationend', handler);
    });
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

botaoCadastreseAqui.addEventListener('click', function (event) {
    event.preventDefault();
    abrirPainel('cadastro');
});

botaoRealizeoLogin.addEventListener('click', function (event) {
    event.preventDefault();
    abrirPainel('login');
});

// FUNÇÃO PARA ENVIAR OS DADOS DO FORMULÁRIO DE CADASTRO
formCadastro.addEventListener('submit', async function (event) {
    event.preventDefault();

    const nome = document.getElementById('cadastroNome').value;
    const cpf = document.getElementById('cadastroCpf').value;
    const email = document.getElementById('cadastroEmail').value;
    const senha = document.getElementById('cadastroSenha').value;
    const senhaConf = document.getElementById('cadastroSenhaConf').value;

    if (senha !== senhaConf) {
        mostrarAlerta('As senhas não conferem.', 'erro');
        return;
    }

    if (cpf.length !== 11) {
    mostrarAlerta('CPF deve ter exatamente 11 dígitos.', 'erro');
    return;
}

    try {
        const response = await fetch('/api/usuarios/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, cpf, email, senha }),
        });

        if (response.ok) {
            mostrarAlerta('Usuário cadastrado com sucesso.', 'sucesso');
            event.target.reset();
            abrirPainel('login');
            return;
        }

        const errorData = await response.json();
        mostrarAlerta(`Erro: ${errorData.message || 'Erro ao cadastrar'}`, 'erro');
    } catch (error) {
        mostrarAlerta('Erro ao cadastrar usuário.', 'erro');
    }
});
