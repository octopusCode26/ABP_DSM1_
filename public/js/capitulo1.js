const ID_MODULO = 1;

const pilaresData = {
  transparencia: {
    titulo: "Transparência",
    texto:
      "Informações importantes sobre o trabalho, o progresso, os problemas e os objetivos devem estar claras para todos os envolvidos. Quando ninguém sabe o que está acontecendo, surgem monstros terríveis: o Bug Invisível, o Requisito Perdido e o lendário 'Achei que você ia fazer'.",
  },
  inspecao: {
    titulo: "Inspeção",
    texto:
      "O progresso, o produto e o modo de trabalho devem ser verificados regularmente para encontrar desvios, problemas e oportunidades de melhoria. Inspecionar não é procurar culpados. É procurar sinais.",
  },
  adaptacao: {
    titulo: "Adaptação",
    texto:
      "Quando algo foge do esperado, o time deve corrigir o rumo o mais rápido possível. Mudanças não são necessariamente maldições; às vezes são pistas, às vezes são oportunidades.",
  },
};

const runasData = {
  individuos: {
    titulo: "Indivíduos e interações",
    texto:
      "Ferramentas ajudam. Processos também. Mas são as pessoas que resolvem problemas, conversam, colaboram e percebem quando algo está errado.",
  },
  software: {
    titulo: "Software funcionando",
    texto:
      "Documentação tem valor, mas o verdadeiro progresso aparece quando existe algo funcionando, utilizável e capaz de gerar aprendizado.",
  },
  cliente: {
    titulo: "Colaboração com o cliente",
    texto:
      "O cliente participa, dá feedback e ajuda o time a entender o que realmente gera valor. Ele não aparece só no fim para reclamar diante do castelo em chamas.",
  },
  mudancas: {
    titulo: "Responder a mudanças",
    texto:
      "Planejar é importante, mas seguir um plano cego quando o mundo mudou é como atravessar uma ponte que já caiu só porque ela ainda está bonita no mapa.",
  },
};

const principiosData = {
  1: {
    titulo: "Valor ao Cliente",
    texto:
      "A maior prioridade é satisfazer o cliente por meio da entrega cedo e contínua de valor.",
  },
  2: {
    titulo: "Mudanças São Bem-vindas",
    texto:
      "Mudanças de requisitos podem ser aceitas, mesmo tardiamente, quando ajudam a gerar vantagem e valor.",
  },
  3: {
    titulo: "Entregas Frequentes",
    texto:
      "Entregue partes funcionais do produto com frequência para aprender, testar e ajustar cedo.",
  },
  4: {
    titulo: "Colaboração Constante",
    texto:
      "Pessoas de negócio e desenvolvedores devem trabalhar juntos frequentemente.",
  },
  5: {
    titulo: "Times Motivados",
    texto:
      "Projetos devem ser construídos ao redor de pessoas motivadas, com apoio, confiança e condições adequadas.",
  },
  6: {
    titulo: "Comunicação Clara",
    texto:
      "A forma mais eficiente de transmitir informações é a conversa direta.",
  },
  7: {
    titulo: "Software Funcionando",
    texto: "Software funcionando é a principal medida de progresso.",
  },
  8: {
    titulo: "Ritmo Sustentável",
    texto:
      "O trabalho deve manter um ritmo constante e saudável. Heróis exaustos erram até magia simples.",
  },
  9: {
    titulo: "Excelência Técnica",
    texto: "Excelência técnica e bom design aumentam a agilidade.",
  },
  10: {
    titulo: "Simplicidade",
    texto:
      "Simplicidade é essencial. Não construa uma catapulta para abrir uma gaveta.",
  },
  11: {
    titulo: "Equipes Auto-organizadas",
    texto:
      "As melhores soluções surgem de equipes com autonomia para decidir como realizar o trabalho.",
  },
  12: {
    titulo: "Melhoria Contínua",
    texto:
      "Em intervalos regulares, o time reflete sobre como melhorar e ajusta seu comportamento.",
  },
};

function obterToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return null;
  }

  return token;
}

const SCROLL_OFFSET = 150;

function rolarParaElemento(seletor, offset = SCROLL_OFFSET) {
  const alvo = document.querySelector(seletor);

  if (!alvo) return;

  const posicaoAlvo =
    alvo.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top: posicaoAlvo,
    behavior: "smooth",
  });
}

function configurarScrollParaBotoes() {
  document.querySelectorAll("[data-scroll-to]").forEach((botao) => {
    botao.addEventListener("click", () => {
      rolarParaElemento(botao.dataset.scrollTo);
    });
  });
}

function ajustarScrollPorHashInicial() {
  const hash = window.location.hash;

  if (!hash) return;

  setTimeout(() => {
    rolarParaElemento(hash);
  }, 250);
}

function configurarRevealNoScroll() {
  const elementos = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
      });
    },
    {
      threshold: 0.18,
    },
  );

  elementos.forEach((el) => observer.observe(el));
}

function configurarProgressoVisual() {
  const secoes = document.querySelectorAll("[data-step]");
  const marcadores = document.querySelectorAll(
    ".chapter-progress .progress-item",
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const step = entry.target.dataset.step;

        marcadores.forEach((marcador) => {
          marcador.classList.toggle("active", marcador.dataset.step === step);
        });
      });
    },
    {
      threshold: 0.45,
    },
  );

  secoes.forEach((secao) => observer.observe(secao));
}

function configurarPilares() {
  const card = document.getElementById("pilar-info");

  document.querySelectorAll(".pilar-btn").forEach((botao) => {
    botao.addEventListener("click", () => {
      const pilar = pilaresData[botao.dataset.pilar];
      if (!pilar || !card) return;

      card.innerHTML = `
        <h3>${pilar.titulo}</h3>
        <p>${pilar.texto}</p>
      `;
    });
  });
}

function configurarRunas() {
  const card = document.getElementById("runa-info");

  document.querySelectorAll(".runa-btn").forEach((botao) => {
    botao.addEventListener("click", () => {
      const runa = runasData[botao.dataset.runa];
      if (!runa || !card) return;

      botao.classList.add("lido");

      card.innerHTML = `
        <h3>${runa.titulo}</h3>
        <p>${runa.texto}</p>
      `;
    });
  });
}

function configurarPrincipios() {
  const card = document.getElementById("principio-info");

  document.querySelectorAll(".principio-btn").forEach((botao) => {
    botao.addEventListener("click", () => {
      const principio = principiosData[botao.dataset.principio];
      if (!principio || !card) return;

      botao.classList.add("lido");

      card.innerHTML = `
        <h3>${principio.titulo}</h3>
        <p>${principio.texto}</p>
      `;
    });
  });
}

function configurarPergaminho() {
  const btn = document.getElementById("btnPergaminho");
  const texto = document.getElementById("pergaminhoTexto");

  if (!btn || !texto) return;

  btn.addEventListener("click", () => {
    texto.classList.toggle("hidden");
    btn.textContent = texto.classList.contains("hidden")
      ? "Ler pergaminho"
      : "Fechar pergaminho";
  });
}

function configurarFogueiraBurningdown() {
  const fogueira = document.getElementById("btnFogueiraBurningdown");

  if (!fogueira) return;

  fogueira.addEventListener("click", () => {
    sessionStorage.setItem("origemBurningdown", "capitulo1");
    sessionStorage.setItem("retornoBurningdown", "/capitulo1#fogueira");

    window.location.href = "/burningdown";
  });
}

function configurarBacklogVivo() {
  const backlogVivo = document.querySelector(".backlog-vivo");
  const lista = document.getElementById("backlogLista");
  const btnPriorizar = document.getElementById("btnPriorizarBacklog");
  const btnBaguncar = document.getElementById("btnBaguncarBacklog");
  const info = document.getElementById("backlogInfo");

  if (!backlogVivo || !lista || !btnPriorizar || !btnBaguncar || !info) return;

  const ordemInicial = Array.from(lista.children);

  function atualizarRanks(priorizado = false) {
    const cards = Array.from(lista.querySelectorAll(".backlog-card"));

    cards.forEach((card, index) => {
      const rank = card.querySelector(".backlog-rank");

      if (!rank) return;

      rank.textContent = priorizado ? index + 1 : "?";
    });
  }

  function priorizarBacklog() {
    const cardsOrdenados = Array.from(lista.querySelectorAll(".backlog-card"))
      .sort((a, b) => {
        return Number(a.dataset.prioridade) - Number(b.dataset.prioridade);
      });

    cardsOrdenados.forEach((card) => {
      lista.appendChild(card);
    });

    backlogVivo.classList.add("priorizado");
    atualizarRanks(true);

    btnPriorizar.classList.add("hidden");
    btnBaguncar.classList.remove("hidden");

    info.innerHTML = `
      <h3>Backlog priorizado</h3>
      <p>
        As tarefas se reorganizam no pergaminho. No Scrum, o Product Backlog
        é uma lista viva e ordenada. Os itens de maior valor, urgência ou risco
        costumam ficar no topo para orientar as próximas decisões.
      </p>
    `;
  }

  function baguncarBacklog() {
    ordemInicial.forEach((card) => {
      lista.appendChild(card);
    });

    backlogVivo.classList.remove("priorizado");
    atualizarRanks(false);

    btnBaguncar.classList.add("hidden");
    btnPriorizar.classList.remove("hidden");

    info.innerHTML = `
      <h3>O pergaminho voltou a se agitar...</h3>
      <p>
        Sem priorização, o time pode se perder entre ideias, melhorias e problemas.
        Clique em “Priorizar Backlog” para ordenar novamente a missão.
      </p>
    `;
  }

  lista.querySelectorAll(".backlog-card").forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.add("lido");

      info.innerHTML = `
        <h3>${card.dataset.titulo}</h3>
        <p>${card.dataset.explicacao}</p>
      `;
    });
  });

  btnPriorizar.addEventListener("click", priorizarBacklog);
  btnBaguncar.addEventListener("click", baguncarBacklog);

  atualizarRanks(false);
}



async function concluirHistoria() {
  const token = obterToken();

  const btnConcluir = document.getElementById("btnConcluirHistoria");
  const btnDesafio = document.getElementById("btnIrDesafio");
  const status = document.getElementById("statusHistoria");

  if (!token) return;

  if (btnConcluir) {
    btnConcluir.disabled = true;
    btnConcluir.textContent = "Registrando progresso...";
  }

  if (status) {
    status.textContent = "A dungeon está registrando sua jornada...";
  }

  try {
    const response = await fetch(
      `/api/progresso/historia/${ID_MODULO}/concluir`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Não foi possível registrar o progresso.",
      );
    }

    localStorage.setItem(`historia_modulo_${ID_MODULO}_concluida`, "true");

    if (status) {
      status.textContent = "História concluída. A primeira porta foi liberada.";
    }

    if (btnConcluir) {
      btnConcluir.classList.add("hidden");
    }

    if (btnDesafio) {
      btnDesafio.classList.remove("hidden");
      btnDesafio.disabled = false;
    }
  } catch (error) {
    console.error(error);

    if (status) {
      status.textContent = "Erro ao registrar progresso. Tente novamente.";
    }

    if (btnConcluir) {
      btnConcluir.disabled = false;
      btnConcluir.textContent = "Tentar concluir novamente";
    }
  }
}

function configurarConclusaoHistoria() {
  const btnConcluir = document.getElementById("btnConcluirHistoria");
  const btnDesafio = document.getElementById("btnIrDesafio");

  if (btnConcluir) {
    btnConcluir.addEventListener("click", concluirHistoria);
  }

  if (btnDesafio) {
    btnDesafio.addEventListener("click", () => {
      localStorage.setItem("moduloAtual", ID_MODULO);
      window.location.href = "/questionario1";
    });
  }
}

/**
 * Desbloqueia navbar ao rolar até o final do capítulo - VERSÃO DEBUG
 */
function configurarDesbloqueioPorScroll() {
  console.log('🔍 [DEBUG] configurarDesbloqueioPorScroll iniciado');
  
  const secaoFinal = document.getElementById('porta');
  
  if (!secaoFinal) {
    console.error('❌ [DEBUG] Elemento #porta NÃO encontrado!');
    return;
  }
  
  console.log('✅ [DEBUG] Elemento #porta encontrado:', secaoFinal);

  // Verifica se funções do main.js estão disponíveis
  if (typeof usuarioConcluiuCapitulo1 !== 'function') {
    console.error('❌ [DEBUG] Função usuarioConcluiuCapitulo1 NÃO encontrada! main.js carregou depois?');
  }
  
  if (typeof marcarCapitulo1Concluido !== 'function') {
    console.error('❌ [DEBUG] Função marcarCapitulo1Concluido NÃO encontrada! main.js carregou depois?');
  }

  const observer = new IntersectionObserver(
    (entries) => {
      console.log('👁️ [DEBUG] IntersectionObserver acionado:', entries);
      
      // Verifica se já concluiu
      if (typeof usuarioConcluiuCapitulo1 === 'function' && usuarioConcluiuCapitulo1()) {
        console.log('✅ [DEBUG] Usuário já concluiu capítulo - observer desconectado');
        observer.disconnect();
        return;
      }

      entries.forEach((entry) => {
        console.log('📊 [DEBUG] Entry:', {
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          target: entry.target.id
        });
        
        if (entry.isIntersecting) {
          console.log('🎯 [DEBUG] Seção final visível! Desbloqueando navbar...');
          
          if (typeof marcarCapitulo1Concluido === 'function') {
            marcarCapitulo1Concluido();
            console.log('✅ [DEBUG] marcarCapitulo1Concluido() executado');
          } else {
            console.error('❌ [DEBUG] marcarCapitulo1Concluido NÃO é uma função!');
          }
          
          observer.disconnect();
          console.log('🔌 [DEBUG] Observer desconectado após desbloqueio');
        }
      });
    },
    { 
      threshold: 0.5 // Reduzido para 50% para facilitar o teste
    }
  );

  observer.observe(secaoFinal);
  console.log('👁️ [DEBUG] Observer observando elemento #porta');
}


document.addEventListener("DOMContentLoaded", () => {
  obterToken();

  configurarScrollParaBotoes();
  ajustarScrollPorHashInicial();
  configurarRevealNoScroll();
  configurarProgressoVisual();
  configurarPilares();
  configurarRunas();
  configurarPrincipios();
  configurarPergaminho();
  configurarConclusaoHistoria();
  configurarFogueiraBurningdown();
  configurarBacklogVivo();
  
  // ✅ NOVO: Desbloqueio por scroll até o final (só na primeira vez)
  configurarDesbloqueioPorScroll();
  
  // Verifica navbar após inicialização
  if (typeof verificarEAtualizarNavbar === 'function') {
    verificarEAtualizarNavbar();
  }
});
