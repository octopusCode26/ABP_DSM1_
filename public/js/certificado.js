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
      )}.png`;

      const canvas = await html2canvas(certificado, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = nomeArquivo;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
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

carregarCertificado();
configurarDownloadCertificado();
