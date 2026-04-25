let paginaAtual = 0;
const pilaresVisitados = new Set();





//-------- INDEX COM LOGIN E CADASTRO--------
const botaoCadastro = document.getElementById('ir_cadastro');
const botaoLogin = document.getElementById('ir_login');
const painelAuth = document.getElementById('painelAuth');
const overlayEscuro = document.getElementById('overlayEscuro');
const botaoFechar = document.getElementById('fecharAuth');
const formLogin = document.getElementById('formLogin');
const formCadastro = document.getElementById('formCadastro');


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
botaoCadastro.addEventListener('click', function() {
  abrirPainel('login');
});

botaoLogin.addEventListener('click', function() {
  abrirPainel('cadastro');
});

botaoFechar.addEventListener('click', function() {
  fecharPainel();
});

overlayEscuro.addEventListener('click', function() {
  fecharPainel();
});







/* ===== CARROSSEL ===== */
function mudarPagina(direcao) {
    const total = document.querySelectorAll('.conteudo > div').length;
    paginaAtual = Math.max(0, Math.min(paginaAtual + direcao, total - 1));

    document.querySelector('.carrossel').scrollTo({
        left: paginaAtual * window.innerWidth,
        behavior: 'smooth'
    });
}





/* ===== PILARES ===== */
function abrirPilar(num) {
    document.getElementById(`pilar${num}Modal`).style.display = 'flex';
    pilaresVisitados.add(num);

    if (pilaresVisitados.size === 3) {
        document.querySelector('.button_pergaminho').classList.add('ativo');
    }
}

function fecharPilar(num) {
    document.getElementById(`pilar${num}Modal`).style.display = 'none';
}

/* ===== PERGAMINHO ===== */
function fecharPergaminho() {
    document.getElementById('modalPergaminho').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.button_pergaminho').addEventListener('click', (e) => {
        if (e.currentTarget.classList.contains('ativo')) {
            document.getElementById('modalPergaminho').style.display = 'flex';
        }
    });
});