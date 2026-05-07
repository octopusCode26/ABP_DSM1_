/* ============================================================
★ CONFIGURAÇÃO DE DESBLOQUEIO DOS ÍCONES ★
─────────────────────────────────────────
DESBLOQUEAR_AO_ENTRAR_STAGE
    → Chave = número da stage.
    Valor  = array de ícones desbloqueados ao entrar nessa stage.
    Para desbloquear em outro momento (evento, ação do usuário),
    hame diretamente: desbloquearIcone('nomeDoIcone')
============================================================ */
const ICONES_INICIAIS_DESBLOQUEADOS = ['desafio', 'perfil'];

const DESBLOQUEAR_AO_ENTRAR_STAGE = {
    // stage 3: desbloqueia Artefatos ao chegar na fogueira
    3: ['artefatos'],

    // Exemplo para stages futuras — basta adicionar aqui:
    // 4: ['progresso'],
};

/* ============================================================
STAGES
============================================================ */
const stageAntes = { 1: null, 2: 1, 3: 2 };
const stageDepois = { 1: 2, 2: 3, 3: null };
const bloqueioAvancar = { 1: () => pilaresLidos.size < 3 };

let stageAtual = 1;

function irParaStage(n) {
    const destino = document.getElementById('stage' + n);
    if (!destino) return;

    document.querySelectorAll('.stage').forEach(s => s.classList.remove('active'));
    destino.classList.add('active');
    stageAtual = n;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Desbloqueia ícones configurados para esta stage
    const iconesDaStage = DESBLOQUEAR_AO_ENTRAR_STAGE[n];
    if (iconesDaStage) iconesDaStage.forEach(desbloquearIcone);

    atualizarNav();
}

function navVoltar() {
    const a = stageAntes[stageAtual];
    if (a) irParaStage(a);
}

function navAvancar() {
    const p = stageDepois[stageAtual];
    if (!p) return;
    const b = bloqueioAvancar[stageAtual];
    if (b && b()) return;
    irParaStage(p);
}

function atualizarNav() {
    const vBtn = document.getElementById('btnVoltar');
    const aBtn = document.getElementById('btnAvancar');

    vBtn.style.visibility = stageAntes[stageAtual] ? 'visible' : 'hidden';

    if (!stageDepois[stageAtual]) {
        aBtn.style.visibility = 'hidden';
    } else {
        aBtn.style.visibility = 'visible';
        const b = bloqueioAvancar[stageAtual];
        const t = !!(b && b());
        aBtn.disabled = t;
        aBtn.classList.toggle('bloqueado', t);
    }
}

/* ============================================================
SISTEMA DE BLOQUEIO DOS ÍCONES
============================================================ */

/**
 * Desbloqueia um ícone pelo seu data-icon.
 * Pode ser chamado de qualquer lugar do código:
 *   desbloquearIcone('artefatos')
 */
function desbloquearIcone(nome) {
    const btn = document.querySelector(`.nav_icon[data-icon="${nome}"]`);
    if (btn) btn.classList.remove('travado');
}

/**
 * Bloqueia um ícone (caso precise reverter).
 */
function bloquearIcone(nome) {
    const btn = document.querySelector(`.nav_icon[data-icon="${nome}"]`);
    if (btn) btn.classList.add('travado');
}

/**
 * Intercepta cliques nos ícones — ignora se estiver travado.
 */
function clicarIcone(el) {
    if (el.classList.contains('travado')) return;
    const nome = el.dataset.icon;
    const acoes = { desafio: abrirDesafio, progresso: abrirProgresso, artefatos: abrirArtefatos, perfil: abrirPerfil };
    if (acoes[nome]) acoes[nome]();
}

/**
 * Inicialização: trava todos os ícones e depois desbloqueia
 * apenas os que estão em ICONES_INICIAIS_DESBLOQUEADOS.
 */
function inicializarIcones() {
    document.querySelectorAll('.nav_icon[data-icon]').forEach(btn => btn.classList.add('travado'));
    ICONES_INICIAIS_DESBLOQUEADOS.forEach(desbloquearIcone);
}

/* ============================================================
PILARES
============================================================ */
const pilaresData = [
    { titulo: "Transparência", texto: "Aspectos importantes do processo devem estar visíveis a todos os envolvidos, promovendo uma compreensão comum, confiança e comunicação aberta" },
    { titulo: "Inspeção", texto: "O progresso, produtos e processos devem ser inspecionados frequentemente para detectar variações ou problemas indesejados." },
    { titulo: "Adaptação", texto: "Se um aspecto do processo desviar do aceitável, o ajuste deve ser feito o mais rápido possível para minimizar desvios futuros." }
];

const pilaresLidos = new Set();

function abrirPilar(el) {
    const idx = parseInt(el.dataset.index);
    document.getElementById('pilarCardTitulo').textContent = pilaresData[idx].titulo;
    document.getElementById('pilarCardTexto').textContent = pilaresData[idx].texto;
    document.getElementById('pilarCard').style.display = 'block';
    document.querySelectorAll('.pilar').forEach(p => p.classList.remove('selecionado'));
    el.classList.add('selecionado');
    pilaresLidos.add(idx);
    atualizarNav();
}

/* ============================================================
PERGAMINHO
============================================================ */
function lerPergaminho() {
    const exp = document.getElementById('pergaminhoExpandido');
    const btn = document.getElementById('lerPergaminhoBtn');
    const open = exp.style.display !== 'none';
    exp.style.display = open ? 'none' : 'block';
    btn.textContent = open ? '"Ler pergaminho..."' : '"Fechar pergaminho..."';
}

/* ============================================================
AÇÕES DOS ÍCONES (implemente conforme necessário)
============================================================ */
function abrirDesafio() { /* TODO */ }
function abrirProgresso() { /* TODO */ }
function abrirArtefatos() { /* TODO */ }
function abrirPerfil() { /* TODO */ }

/* ============================================================
INIT
============================================================ */
inicializarIcones();
atualizarNav();


/* ============================================================
★ CONFIGURAÇÃO DE DESBLOQUEIO DOS ÍCONES ★
─────────────────────────────────────────
DESBLOQUEAR_AO_ENTRAR_STAGE
    → Chave = número da stage.
    Valor  = array de ícones desbloqueados ao entrar nessa stage.
    Para desbloquear em outro momento (evento, ação do usuário),
    hame diretamente: desbloquearIcone('nomeDoIcone')
============================================================ */
const ICONES_INICIAIS_DESBLOQUEADOS = ['desafio', 'perfil'];

const DESBLOQUEAR_AO_ENTRAR_STAGE = {
    // stage 3: desbloqueia Artefatos ao chegar na fogueira
    3: ['artefatos'],

    // Exemplo para stages futuras — basta adicionar aqui:
    // 4: ['progresso'],
};

/* ============================================================
STAGES
============================================================ */
const stageAntes = { 1: null, 2: 1, 3: 2 };
const stageDepois = { 1: 2, 2: 3, 3: null };
const bloqueioAvancar = { 1: () => pilaresLidos.size < 3 };

let stageAtual = 1;

function irParaStage(n) {
    const destino = document.getElementById('stage' + n);
    if (!destino) return;

    document.querySelectorAll('.stage').forEach(s => s.classList.remove('active'));
    destino.classList.add('active');
    stageAtual = n;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Desbloqueia ícones configurados para esta stage
    const iconesDaStage = DESBLOQUEAR_AO_ENTRAR_STAGE[n];
    if (iconesDaStage) iconesDaStage.forEach(desbloquearIcone);

    atualizarNav();
}

function navVoltar() {
    const a = stageAntes[stageAtual];
    if (a) irParaStage(a);
}

function navAvancar() {
    const p = stageDepois[stageAtual];
    if (!p) return;
    const b = bloqueioAvancar[stageAtual];
    if (b && b()) return;
    irParaStage(p);
}

function atualizarNav() {
    const vBtn = document.getElementById('btnVoltar');
    const aBtn = document.getElementById('btnAvancar');

    vBtn.style.visibility = stageAntes[stageAtual] ? 'visible' : 'hidden';

    if (!stageDepois[stageAtual]) {
        aBtn.style.visibility = 'hidden';
    } else {
        aBtn.style.visibility = 'visible';
        const b = bloqueioAvancar[stageAtual];
        const t = !!(b && b());
        aBtn.disabled = t;
        aBtn.classList.toggle('bloqueado', t);
    }
}

/* ============================================================
SISTEMA DE BLOQUEIO DOS ÍCONES
============================================================ */

/**
 * Desbloqueia um ícone pelo seu data-icon.
 * Pode ser chamado de qualquer lugar do código:
 *   desbloquearIcone('artefatos')
 */
function desbloquearIcone(nome) {
    const btn = document.querySelector(`.nav_icon[data-icon="${nome}"]`);
    if (btn) btn.classList.remove('travado');
}

/**
 * Bloqueia um ícone (caso precise reverter).
 */
function bloquearIcone(nome) {
    const btn = document.querySelector(`.nav_icon[data-icon="${nome}"]`);
    if (btn) btn.classList.add('travado');
}

/**
 * Intercepta cliques nos ícones — ignora se estiver travado.
 */
function clicarIcone(el) {
    if (el.classList.contains('travado')) return;
    const nome = el.dataset.icon;
    const acoes = { desafio: abrirDesafio, progresso: abrirProgresso, artefatos: abrirArtefatos, perfil: abrirPerfil };
    if (acoes[nome]) acoes[nome]();
}

/**
 * Inicialização: trava todos os ícones e depois desbloqueia
 * apenas os que estão em ICONES_INICIAIS_DESBLOQUEADOS.
 */
function inicializarIcones() {
    document.querySelectorAll('.nav_icon[data-icon]').forEach(btn => btn.classList.add('travado'));
    ICONES_INICIAIS_DESBLOQUEADOS.forEach(desbloquearIcone);
}

/* ============================================================
PILARES
============================================================ */
const pilaresData = [
    { titulo: "Transparência", texto: "Aspectos importantes do processo devem estar visíveis a todos os envolvidos, promovendo uma compreensão comum, confiança e comunicação aberta" },
    { titulo: "Inspeção", texto: "O progresso, produtos e processos devem ser inspecionados frequentemente para detectar variações ou problemas indesejados." },
    { titulo: "Adaptação", texto: "Se um aspecto do processo desviar do aceitável, o ajuste deve ser feito o mais rápido possível para minimizar desvios futuros." }
];

const pilaresLidos = new Set();

function abrirPilar(el) {
    const idx = parseInt(el.dataset.index);
    document.getElementById('pilarCardTitulo').textContent = pilaresData[idx].titulo;
    document.getElementById('pilarCardTexto').textContent = pilaresData[idx].texto;
    document.getElementById('pilarCard').style.display = 'block';
    document.querySelectorAll('.pilar').forEach(p => p.classList.remove('selecionado'));
    el.classList.add('selecionado');
    pilaresLidos.add(idx);
    atualizarNav();
}

/* ============================================================
PERGAMINHO
============================================================ */
function lerPergaminho() {
    const exp = document.getElementById('pergaminhoExpandido');
    const btn = document.getElementById('lerPergaminhoBtn');
    const open = exp.style.display !== 'none';
    exp.style.display = open ? 'none' : 'block';
    btn.textContent = open ? '"Ler pergaminho..."' : '"Fechar pergaminho..."';
}

/* ============================================================
AÇÕES DOS ÍCONES (implemente conforme necessário)
============================================================ */
function abrirDesafio() { /* TODO */ }
function abrirProgresso() { /* TODO */ }
function abrirArtefatos() { /* TODO */ }
function abrirPerfil() { /* TODO */ }

/* ============================================================
INIT
============================================================ */
inicializarIcones();
atualizarNav();
