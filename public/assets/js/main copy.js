let paginaAtual = 0;
const pilaresVisitados = new Set();

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