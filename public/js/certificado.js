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

  console.log("soma:", soma);
console.log("total:", total);
console.log("media:", media);
console.log("elemento media:", mediaElemento);

  mediaElemento.textContent =
    `${media.toFixed(2)}%`;
}
carregarCertificado();
