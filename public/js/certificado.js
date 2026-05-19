async function carregarCertificado() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return;
  }

  try {
    const usuarioResponse = await fetch("/api/usuarios/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const usuario = await usuarioResponse.json();

    if (!usuarioResponse.ok) {
      alert(usuario.message || "Erro ao carregar usuário");
      return;
    }

    document.getElementById("certificadoNome").textContent = usuario.nome;
    document.getElementById("certificadoCpf").textContent = formatarCpf(
      usuario.cpf,
    );
    document.getElementById("certificadoEmail").textContent = usuario.email;
    document.getElementById("certificadoData").textContent =
      new Date().toLocaleDateString("pt-BR");

    const desempenhoResponse = await fetch("/api/certificados/desempenho", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const desempenho = await desempenhoResponse.json();

    if (desempenhoResponse.ok) {
      preencherDesempenho(desempenho);
    }

    // Por enquanto deixamos visual.
    // Depois podemos puxar notas reais da API de certificado.
    
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar certificado");
  }
}

function formatarCpf(cpf) {
  const somenteNumeros = String(cpf || "").replace(/\D/g, "");

  if (somenteNumeros.length !== 11) {
    return cpf || "";
  }

  return somenteNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function preencherDesempenho(desempenho) {
  let soma = 0;
  let total = 0;

  desempenho.notas.forEach(function (item) {
    const notaNumero = Number(item.nota);

    const elemento = document.getElementById(
      `notaNivel${item.modulo}`
    );

    if (elemento) {
      elemento.textContent =
        !isNaN(notaNumero)
          ? `${notaNumero.toFixed(2)}%`
          : "--";
    }

    if (!isNaN(notaNumero)) {
      soma += notaNumero;
      total++;
    }
  });

  const mediaElemento =
    document.getElementById("certificadoMedia");

  if (!mediaElemento) {
    return;
  }

  if (total === 0) {
    mediaElemento.textContent = "--";
    return;
  }

  const media = soma / total;


  mediaElemento.textContent =
    `${media.toFixed(2)}%`;
}

function ajustarEscalaCertificado() {
  const visualizacao = document.getElementById("certificadoVisualizacao");
  const certificado = document.getElementById("certificadoParaDownload");
  const main = document.querySelector(".pagina-certificado main");
  const botoes = document.querySelector(".certificado-botoes-area");

  if (!visualizacao || !certificado || !main) {
    return;
  }

  const larguraCertificado = certificado.offsetWidth;
  const alturaCertificado = certificado.offsetHeight;
  const estilosMain = getComputedStyle(main);
  const estilosVisualizacao = getComputedStyle(visualizacao);
  const paddingHorizontal =
    obterNumeroCss(estilosMain.paddingLeft) +
    obterNumeroCss(estilosMain.paddingRight);
  const paddingVertical =
    obterNumeroCss(estilosMain.paddingTop) +
    obterNumeroCss(estilosMain.paddingBottom);
  const margemVertical =
    obterNumeroCss(estilosVisualizacao.marginTop) +
    obterNumeroCss(estilosVisualizacao.marginBottom);
  const alturaBotoes = botoes ? botoes.offsetHeight : 0;

  const larguraDisponivel = Math.max(1, main.clientWidth - paddingHorizontal);
  const alturaDisponivel = Math.max(
    1,
    main.clientHeight - paddingVertical - alturaBotoes - margemVertical
  );
  const escala = Math.min(
    1,
    larguraDisponivel / larguraCertificado,
    alturaDisponivel / alturaCertificado
  );

  document.documentElement.style.setProperty(
    "--certificado-escala",
    escala.toFixed(4)
  );

  visualizacao.style.width = `${larguraCertificado * escala}px`;
  visualizacao.style.height = `${alturaCertificado * escala}px`;
}

function obterNumeroCss(valor) {
  const numero = parseFloat(valor);
  return Number.isFinite(numero) ? numero : 0;
}

function configurarDownloadCertificado() {
  const botaoDownload = document.getElementById("btnDownloadCertificado");
  const certificado = document.getElementById("certificadoParaDownload");

  if (!botaoDownload || !certificado) {
    return;
  }

  botaoDownload.addEventListener("click", async function () {
    try {
      botaoDownload.disabled = true;

      const nomeUsuario =
        document.getElementById("certificadoNome")?.textContent || "aluno";

      const nomeArquivo = `certificado-scrum-dungeon-${normalizarNomeArquivo(
        nomeUsuario
      )}.pdf`;

      const certificadoExportacao = certificado.cloneNode(true);
      certificadoExportacao.id = "certificadoParaDownloadExportacao";
      certificadoExportacao.classList.add("certificado-exportando");
      document.body.appendChild(certificadoExportacao);

      const canvas = await html2canvas(certificadoExportacao, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        width: certificadoExportacao.offsetWidth,
        height: certificadoExportacao.offsetHeight,
        windowWidth: certificadoExportacao.scrollWidth,
        windowHeight: certificadoExportacao.scrollHeight,
      });

      certificadoExportacao.remove();

      const jsPdf = window.jspdf?.jsPDF;

      if (!jsPdf) {
        throw new Error("Biblioteca jsPDF nao carregada.");
      }

      const pdf = new jsPdf({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const imagem = canvas.toDataURL("image/png");
      pdf.addImage(imagem, "PNG", 0, 0, 297, 210);
      pdf.save(nomeArquivo);
    } catch (error) {
      document.getElementById("certificadoParaDownloadExportacao")?.remove();
      console.error(error);
      alert("Não foi possível baixar o certificado.");
    } finally {
      botaoDownload.disabled = false;
    }
  });
}

function normalizarNomeArquivo(nome) {
  return String(nome)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

ajustarEscalaCertificado();
window.addEventListener("resize", ajustarEscalaCertificado);
window.addEventListener("load", ajustarEscalaCertificado);
window.visualViewport?.addEventListener("resize", ajustarEscalaCertificado);

carregarCertificado();
configurarDownloadCertificado();
