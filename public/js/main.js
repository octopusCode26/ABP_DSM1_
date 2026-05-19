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
  const menuToggle = document.getElementById("menuToggle");
  const menuPrincipal = document.getElementById("menuPrincipal");

  // Encerra caso o menu não exista na página
  if (!menuToggle || !menuPrincipal) {
    return;
  }

  /* =========================================
     ABRIR / FECHAR MENU MOBILE
  ========================================= */

  menuToggle.addEventListener("click", function () {
    const aberto = menuPrincipal.classList.toggle("ativo");

    menuToggle.setAttribute("aria-expanded", aberto ? "true" : "false");
  });

  /* =========================================
     FECHAR MENU AO CLICAR EM UM LINK
  ========================================= */

  menuPrincipal.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menuPrincipal.classList.remove("ativo");

      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* =========================================
      RESETAR MENU AO VOLTAR PARA DESKTOP
  ========================================= */

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      menuPrincipal.classList.remove("ativo");

      menuToggle.setAttribute("aria-expanded", "false");
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

/* ----------- EVITAR SOBREPOSIÇÃO: NAVBAR INFERIOR + FOOTER -----------  */

function controlarSobreposicaoNavbarFooter() {
  const navbar = document.querySelector(".navegacao-inferior");
  const footer = document.querySelector("footer");
  if (!navbar || !footer) return;

  let isTicking = false;

  function calcularPosicao() {
    // Desktop: ignora e limpa estilos inline para não conflitar
    if (window.innerWidth > 520) {
      navbar.style.removeProperty('bottom');
      return;
    }

    // Se está oculta, não calcula
    if (navbar.classList.contains('bloqueada') || navbar.style.display === 'none') return;

    const footerRect = footer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const gapSeguranca = 0;

    // Footer está na parte inferior da tela?
    const footerVisivel = footerRect.bottom > 0 && footerRect.top < viewportHeight;

    if (footerVisivel) {
      const alturaVisivel = viewportHeight - footerRect.top;
      const novoBottom = Math.max(alturaVisivel + gapSeguranca, 0);
      // ✅ Força sobrescrever o CSS !important
      navbar.style.setProperty('bottom', `${novoBottom}px`, 'important');
    } else {
      navbar.style.setProperty('bottom', '0px', 'important');
    }
  }

  function onScroll() {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        calcularPosicao();
        isTicking = false;
      });
      isTicking = true;
    }
  }

  // Anexa eventos UMA VEZ
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", calcularPosicao);
  calcularPosicao(); // Executa imediatamente no load
}

// Eventos
function inicializarNavegacaoInferior() {
  marcarItemAtivoDaNavegacaoInferior();
  controlarSobreposicaoNavbarFooter();
}

window.addEventListener("load", marcarItemAtivoDaNavegacaoInferior);
document.addEventListener("DOMContentLoaded", inicializarNavegacaoInferior);

/* =========================================================
 ALERTA CUSTOMIZADO
========================================================= */

/*
  TIPOS DISPONÍVEIS:
  - sucesso
  - erro
*/

function mostrarAlerta(mensagem, tipo) {
  const alerta = document.getElementById("custom-alert");
  const texto = document.getElementById("custom-alert-message");

  // Define mensagem
  texto.innerText = mensagem;

  // Remove estados antigos
  alerta.classList.remove("hidden", "sucesso", "erro");

  // Aplica novo tipo
  alerta.classList.add(tipo);

  // Exibe alerta
  alerta.style.display = "flex";
}

/* =========================================
 FECHAR ALERTA
========================================= */

function fecharAlerta() {
  const alerta = document.getElementById("custom-alert");

  alerta.classList.add("hidden");

  alerta.classList.remove("sucesso", "erro");

  alerta.style.display = "none";
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
    `${alturaFooter}px`,
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
    `${alturaHeader}px`,
  );
}

/* =========================================================
 CONTROLE GLOBAL DE NAVEGAÇÃO
========================================================= */

// páginas que NÃO devem entrar no histórico de retorno
const paginasBloqueadas = ["/questionario1", "/resultado", "desafio1"];

// página atual
const paginaAtual = window.location.pathname;

// pega a última página visitada
const paginaAnterior = sessionStorage.getItem("paginaAtual");

// salva como "última válida" apenas se NÃO for bloqueada
if (paginaAnterior && !paginasBloqueadas.includes(paginaAnterior)) {
  sessionStorage.setItem("ultimaPaginaValida", paginaAnterior);
}

// atualiza a página atual
sessionStorage.setItem("paginaAtual", paginaAtual);

/* =========================================================
 BOTÃO VOLTAR INTELIGENTE
========================================================= */

function voltarPagina() {
  const ultimaPaginaValida = sessionStorage.getItem("ultimaPaginaValida");

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
window.addEventListener("load", () => {
  atualizarAlturaFooter();
  atualizarAlturaHeader();
  marcarItemAtivoDaNavegacaoInferior();
});

// Quando a tela é redimensionada
window.addEventListener("resize", atualizarAlturaFooter);

window.addEventListener("resize", atualizarAlturaHeader);

/* =========================================================
   NAVBAR PERMANENTE — CONTROLE POR USUÁRIO
   Usa localStorage com chave única por token para evitar conflitos
========================================================= */

async function controlarVisibilidadeNavbar() {
  const navbar = document.querySelector(".navegacao-inferior");
  if (!navbar) return;

  let deveMostrar = false;
  const token = localStorage.getItem('token');

  // Tenta backend primeiro
  if (token) {
    try {
      const res = await fetch('/api/navbar/status', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.barra_desbloqueada === 'boolean') {
          deveMostrar = data.barra_desbloqueada;
          localStorage.setItem(getChaveProgressoUsuario(), deveMostrar ? 'true' : 'false');
        }
      }
    } catch (e) {
      console.warn('Fallback localStorage', e);
    }
  }

  // Fallback localStorage
  if (!token || typeof deveMostrar !== 'boolean') {
    const chave = getChaveProgressoUsuario();
    deveMostrar = localStorage.getItem(chave) === 'true';
  }

  // Aplica estado final
  if (deveMostrar) {
    navbar.classList.remove('bloqueada', 'hidden');
    navbar.classList.add('navbar-visivel');
    navbar.style.display = 'flex';
  } else {
    navbar.classList.add('bloqueada', 'hidden');
    navbar.classList.remove('navbar-visivel');
    navbar.style.display = 'none';
  }
}

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

// Executa quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", controlarVisibilidadeNavbar);

/*========FUNÇAO LOGOUT===========*/
document.addEventListener("DOMContentLoaded", async () => {
  atualizarAlturaFooter();
  atualizarAlturaHeader();

  await controlarVisibilidadeNavbar();

  // ✅ CHAMA SEMPRE, independente se está visível ou não
  controlarSobreposicaoNavbarFooter();

  marcarItemAtivoDaNavegacaoInferior();

  const botaoLogout = document.getElementById("botao-logout");
  if (botaoLogout && localStorage.getItem("token")) {
    botaoLogout.hidden = false;
    botaoLogout.addEventListener("click", logout);
  }
});

function logout() {
  // Remove os dados de autenticacao salvos no navegador.
  localStorage.removeItem("token");
  localStorage.removeItem("nome");
  localStorage.removeItem("cpf");
  localStorage.removeItem("usuario");

  window.location.href = "/";
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

  // Prioriza buscar do backend se houver token
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
    // URL correta conforme sua estrutura
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
    
    // 👇 MOSTRA O ALERTA (antes do return!)
    if (data.alerta) {
      mostrarAlerta(data.alerta.mensagem, data.alerta.tipo);
    }
    
    console.log('Navbar desbloqueada:', data.mensagem);
    return data.sucesso !== false; // retorna true se sucesso for true ou undefined
    
  } catch (error) {
    console.error('Erro ao desbloquear navbar:', error);
    
    // 👇 Mostra alerta de erro também
    mostrarAlerta('Erro ao desbloquear navbar', 'erro');
    
    return false;
  }
}

// Torna disponível globalmente
window.desbloquearNavbarNoBackend = desbloquearNavbarNoBackend;

// Inicialização automática da navbar em todas as páginas
(async function inicializarNavbarGlobal() {
  atualizarAlturaFooter();
  atualizarAlturaHeader();
  await controlarVisibilidadeNavbar();

  const navbar = document.querySelector(".navegacao-inferior");
  if (navbar && !navbar.classList.contains('bloqueada')) {
    // controlarSobreposicaoNavbarFooter();  ← COMENTE ESTA LINHA (já está no DOMContentLoaded)
  }

  window.addEventListener('popstate', async () => {
    await controlarVisibilidadeNavbar();
  });
})();

function renderizarVidas(container, falhasNoModulo, totalTentativas = 2) {
  if (!container) return;

  container.innerHTML = "";

  const falhas = Number(falhasNoModulo) || 0;

  for (let i = 1; i <= totalTentativas; i++) {
    const img = document.createElement("img");

    img.classList.add("vida-icon");

    if (i <= falhas) {
      img.src = "/assets/img/vida-icon-perdeu.png";
      img.alt = "Tentativa perdida";
    } else {
      img.src = "/assets/img/vida-icon.png";
      img.alt = "Tentativa disponível";
    }

    container.appendChild(img);
  }
}

// Torna funções disponíveis globalmente para outras páginas
window.marcarCapitulo1Concluido = marcarCapitulo1Concluido;
window.usuarioConcluiuCapitulo1 = usuarioConcluiuCapitulo1;
window.verificarEAtualizarNavbar = verificarEAtualizarNavbar;
window.mostrarNavbarInferior = mostrarNavbarInferior;
