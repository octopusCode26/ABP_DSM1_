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
   UTILITÁRIOS PARA NAVBAR INFERIOR — GLOBAIS
========================================================= */

/**
 * Mostra a navbar inferior com animação
 */
function mostrarNavbarInferior() {
  const navbar = document.getElementById('navbarPrincipal');
  if (!navbar) return;
  
  navbar.classList.remove('hidden', 'bloqueada');
  navbar.classList.add('navbar-visivel');
}

/**
 * Esconde a navbar inferior
 */
function esconderNavbarInferior() {
  const navbar = document.getElementById('navbarPrincipal');
  if (!navbar) return;
  
  navbar.classList.remove('navbar-visivel');
  navbar.classList.add('bloqueada');
}

/**
 * Verifica se deve mostrar a navbar baseado no progresso do usuário
 * Executa em QUALQUER página que tenha a navbar no HTML
 */
function verificarEAtualizarNavbar() {
  const navbar = document.getElementById('navbarPrincipal');
  if (!navbar) return;

  const CHAVE_SESSAO = 'sessao_capitulo1_concluido';
  const concluidoNestaSessao = sessionStorage.getItem(CHAVE_SESSAO) === 'true';

  if (concluidoNestaSessao) {
    mostrarNavbarInferior();
  } else {
    esconderNavbarInferior();
  }
}

/* =========================================================
   INICIALIZAÇÃO DA NAVBAR — EXECUTA EM TODAS AS PÁGINAS
========================================================= */

(function() {
  // Função que verifica e atualiza a navbar
  function inicializarNavbar() {
    verificarEAtualizarNavbar();
  }

  // Executa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarNavbar);
  } else {
    inicializarNavbar();
  }
  
  // Garante que execute após todos os recursos carregarem
  window.addEventListener('load', verificarEAtualizarNavbar);
  
  // Reavalia se o usuário navegar com botões voltar/avançar
  window.addEventListener('popstate', verificarEAtualizarNavbar);
})();

/**
 * (Opcional) Busca progresso do servidor ao carregar a página
 * Só executa se houver token de autenticação
 */
async function sincronizarProgressoDoServidor() {
  try {
    if (typeof obterToken !== 'function') return;
    
    const token = obterToken();
    if (!token) return; // Usuário não autenticado

    const response = await fetch('/api/progresso/resumo', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) return;
    
    const data = await response.json();
    
    // Atualiza estado em memória com dados do servidor
    if (data.historias?.[1]?.concluida) {
      window.__progressoSessao = window.__progressoSessao || {};
      window.__progressoSessao.capitulo1 = true;
      
      // Atualiza navbar se já estiver na página
      if (typeof verificarEAtualizarNavbar === 'function') {
        verificarEAtualizarNavbar();
      }
    }
  } catch (error) {
    console.warn('⚠️ Não foi possível sincronizar progresso:', error);
  }
}

// Executa sincronização ao carregar (não bloqueia a página)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', sincronizarProgressoDoServidor);
} else {
  sincronizarProgressoDoServidor();
}