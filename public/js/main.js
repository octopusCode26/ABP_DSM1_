/* =========================================================
   MAIN.JS
   ---------------------------------------------------------
   Arquivo global utilizado em múltiplas páginas do projeto.
   Manter aqui apenas funções compartilhadas entre páginas.
========================================================= */

/* =========================================================
   ESTADO DA SESSÃO (IN-MEMORY)
   - Não persiste entre recarregamentos/contas
   - Usado para controle temporário de UI
========================================================= */
window.__progressoSessao = window.__progressoSessao || {};

/* =========================================================
   MENU MOBILE (HEADER)
========================================================= */

(function () {

  const menuToggle = document.getElementById('menuToggle');
  const menuPrincipal = document.getElementById('menuPrincipal');

  // Encerra caso o menu não exista na página
  if (!menuToggle || !menuPrincipal) {
      return;
  }

  /* =========================================
     ABRIR / FECHAR MENU MOBILE
  ========================================= */

  menuToggle.addEventListener('click', function () {

      const aberto = menuPrincipal.classList.toggle('ativo');

      menuToggle.setAttribute(
          'aria-expanded',
          aberto ? 'true' : 'false'
      );
  });

  /* =========================================
     FECHAR MENU AO CLICAR EM UM LINK
  ========================================= */

  menuPrincipal.querySelectorAll('a').forEach(function (link) {

      link.addEventListener('click', function () {

          menuPrincipal.classList.remove('ativo');

          menuToggle.setAttribute(
              'aria-expanded',
              'false'
          );
      });
  });

  /* =========================================
     RESETAR MENU AO VOLTAR PARA DESKTOP
  ========================================= */

  window.addEventListener('resize', function () {

      if (window.innerWidth > 768) {

          menuPrincipal.classList.remove('ativo');

          menuToggle.setAttribute(
              'aria-expanded',
              'false'
          );
      }
  });

})();


/* =========================================================
 HEADER ATIVO POR SEÇÃO
========================================================= */

function atualizarMenuAtivo() {

  const inicio = document.getElementById("inicio");
  const sobre = document.getElementById("sobre");

  const linkInicio = document.getElementById("linkInicio");
  const linkSobre = document.getElementById("linkSobre");

  // Encerra caso os elementos não existam
  if (!inicio || !sobre || !linkInicio || !linkSobre) {
      return;
  }

  const scrollPos = window.scrollY;

  // Define ponto de ativação da seção Sobre
  const pontoSobre = sobre.offsetTop - 200;

  // Remove classes ativas
  linkInicio.classList.remove("ativo");
  linkSobre.classList.remove("ativo");

  // Define qual item ficará ativo
  if (scrollPos >= pontoSobre) {
      linkSobre.classList.add("ativo");
  } else {
      linkInicio.classList.add("ativo");
  }
}

// Eventos
window.addEventListener("scroll", atualizarMenuAtivo);
window.addEventListener("load", atualizarMenuAtivo);


/* =========================================================
 NAVEGAÇÃO INFERIOR ATIVA
========================================================= */

function marcarItemAtivoDaNavegacaoInferior() {

  const itens = document.querySelectorAll(".navegacao-inferior__item");

  // Encerra caso não existam itens
  if (!itens.length) return;

  // Remove barra final da rota atual
  const rotaAtual = window.location.pathname.replace(/\/$/, "");

  itens.forEach((item) => {

      const rotaItem = item.dataset.rota?.replace(/\/$/, "");

      item.classList.remove("ativo");

      if (rotaAtual === rotaItem) {
          item.classList.add("ativo");
      }
  });
}

// Eventos
document.addEventListener(
  "DOMContentLoaded",
  marcarItemAtivoDaNavegacaoInferior
);

window.addEventListener(
  "load",
  marcarItemAtivoDaNavegacaoInferior
);


/* =========================================================
 ALERTA CUSTOMIZADO
========================================================= */

/*
  TIPOS DISPONÍVEIS:
  - sucesso
  - erro
*/

function mostrarAlerta(mensagem, tipo) {

  const alerta = document.getElementById('custom-alert');
  const texto = document.getElementById('custom-alert-message');

  // Define mensagem
  texto.innerText = mensagem;

  // Remove estados antigos
  alerta.classList.remove(
      'hidden',
      'sucesso',
      'erro'
  );

  // Aplica novo tipo
  alerta.classList.add(tipo);

  // Exibe alerta
  alerta.style.display = 'flex';
}


/* =========================================
 FECHAR ALERTA
========================================= */

function fecharAlerta() {

  const alerta = document.getElementById('custom-alert');

  alerta.classList.add('hidden');

  alerta.classList.remove(
      'sucesso',
      'erro'
  );

  alerta.style.display = 'none';
}


/* =========================================================
 ALTURA DINÂMICA DO FOOTER
========================================================= */

function atualizarAlturaFooter() {

  const footer = document.querySelector("footer");

  // Encerra caso não exista footer
  if (!footer) return;

  const alturaFooter = footer.offsetHeight;

  document.documentElement.style.setProperty(
      "--footer-height",
      `${alturaFooter}px`
  );
}


/* =========================================================
 ALTURA DINÂMICA DO HEADER
========================================================= */

function atualizarAlturaHeader() {

  const header = document.querySelector("header");

  // Encerra caso não exista header
  if (!header) return;

  const alturaHeader = header.offsetHeight;

  document.documentElement.style.setProperty(
      "--header-height",
      `${alturaHeader}px`
  );
}

/* =========================================================
 CONTROLE GLOBAL DE NAVEGAÇÃO
========================================================= */

// páginas que NÃO devem entrar no histórico de retorno
const paginasBloqueadas = [
  "/questionario1",
  "/resultado",
  "desafio1",
];

// página atual
const paginaAtual = window.location.pathname;

// pega a última página visitada
const paginaAnterior = sessionStorage.getItem("paginaAtual");

// salva como "última válida" apenas se NÃO for bloqueada
if (
  paginaAnterior &&
  !paginasBloqueadas.includes(paginaAnterior)
) {
  sessionStorage.setItem(
    "ultimaPaginaValida",
    paginaAnterior
  );
}

// atualiza a página atual
sessionStorage.setItem("paginaAtual", paginaAtual);


/* =========================================================
 BOTÃO VOLTAR INTELIGENTE
========================================================= */

function voltarPagina() {

  const ultimaPaginaValida =
    sessionStorage.getItem("ultimaPaginaValida");

  // se existir uma página salva, usa ela
  if (ultimaPaginaValida) {
    window.location.href = ultimaPaginaValida;
    return;
  }

  // fallback
  window.location.href = "/mapa";
}


/* =========================================================
 EVENTOS GLOBAIS
========================================================= */

// Quando a página termina de carregar
window.addEventListener(
  "load",
  atualizarAlturaFooter
);

window.addEventListener(
  "load",
  atualizarAlturaHeader
);

// Quando a tela é redimensionada
window.addEventListener(
  "resize",
  atualizarAlturaFooter
);

window.addEventListener(
  "resize",
  atualizarAlturaHeader
);

/* =========================================================
   NAVBAR PERMANENTE — CONTROLE POR USUÁRIO
   Usa localStorage com chave única por token para evitar conflitos
========================================================= */

/**
 * Gera chave única de progresso baseada no token do usuário
 */
function getChaveProgressoUsuario() {
  const token = localStorage.getItem('token');
  if (!token) return 'capitulo1_concluido_anon';
  
  // Cria hash simples do token para chave única
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    hash = ((hash << 5) - hash) + token.charCodeAt(i);
    hash |= 0;
  }
  return `capitulo1_concluido_${Math.abs(hash)}`;
}

/**
 * Marca capítulo 1 como concluído para o usuário atual
 */
function marcarCapitulo1Concluido() {
  const chave = getChaveProgressoUsuario();
  localStorage.setItem(chave, 'true');
  mostrarNavbarInferior();
}

/**
 * Verifica se capítulo 1 foi concluído pelo usuário atual
 */
function usuarioConcluiuCapitulo1() {
  const chave = getChaveProgressoUsuario();
  return localStorage.getItem(chave) === 'true';
}

/**
 * Mostra a navbar inferior com animação
 */
function mostrarNavbarInferior() {
  const navbar = document.getElementById('navbarPrincipal');
  if (!navbar) return;
  
  navbar.classList.remove('hidden', 'bloqueada');
  navbar.classList.add('navbar-visivel');
  navbar.style.display = 'flex';
}

/**
 * Esconde a navbar inferior
 */
function esconderNavbarInferior() {
  const navbar = document.getElementById('navbarPrincipal');
  if (!navbar) return;
  
  navbar.classList.remove('navbar-visivel');
  navbar.classList.add('bloqueada');
  navbar.style.display = 'none';
}

/**
 * Verifica e atualiza estado da navbar - EXECUTA EM TODAS AS PÁGINAS
 */
async function verificarEAtualizarNavbar() {
  const navbar = document.getElementById('navbarPrincipal');
  if (!navbar) return;

  // ✅ Prioriza buscar do backend se houver token
  const token = localStorage.getItem('token');
  let barraDesbloqueada = false;

  if (token) {
    const statusBackend = await buscarStatusNavbarDoBackend();
    if (statusBackend !== null) {
      barraDesbloqueada = statusBackend;
    }
  }

  // Atualiza UI conforme status
  if (barraDesbloqueada) {
    mostrarNavbarInferior();
  } else {
    esconderNavbarInferior();
  }
}

/**
 * Busca status da navbar do backend para o usuário logado
 */
async function buscarStatusNavbarDoBackend() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    // ✅ URL correta conforme sua estrutura
    const response = await fetch('/api/navbar/status', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Falha ao buscar status');
    
    const data = await response.json();
    return data.barra_desbloqueada;
  } catch (error) {
    console.error('Erro ao buscar status da navbar:', error);
    return null;
  }
}

/**
 * Desbloqueia navbar no backend
 */
async function desbloquearNavbarNoBackend() {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const response = await fetch('/api/navbar/desbloquear', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Falha ao desbloquear');
    
    const data = await response.json();
    console.log('Navbar desbloqueada:', data.mensagem);
    return true;
  } catch (error) {
    console.error('Erro ao desbloquear navbar:', error);
    return false;
  }
}

// Torna disponível globalmente
window.desbloquearNavbarNoBackend = desbloquearNavbarNoBackend;

// Inicialização automática da navbar em todas as páginas
(function inicializarNavbarGlobal() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      verificarEAtualizarNavbar();
    });
  } else {
    verificarEAtualizarNavbar();
  }
  
  window.addEventListener('popstate', verificarEAtualizarNavbar);
  window.addEventListener('load', verificarEAtualizarNavbar);
})();

// Torna funções disponíveis globalmente para outras páginas
window.marcarCapitulo1Concluido = marcarCapitulo1Concluido;
window.usuarioConcluiuCapitulo1 = usuarioConcluiuCapitulo1;
window.verificarEAtualizarNavbar = verificarEAtualizarNavbar;
window.mostrarNavbarInferior = mostrarNavbarInferior;