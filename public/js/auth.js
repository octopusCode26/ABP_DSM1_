// -------- AUTH: CADASTRO, LOGIN, TOKEN E REDIRECIONAMENTO --------

const formCadastroPopup = document.getElementById("formCadastroPopup");
const formLoginPopup = document.getElementById("formLoginPopup");

if (formCadastroPopup) {
  formCadastroPopup.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.getElementById("cadastroNome").value;
    const cpf = document.getElementById("cadastroCpf").value;
    const email = document.getElementById("cadastroEmail").value;
    const senha = document.getElementById("cadastroSenha").value;
    const confirmarSenha = document.getElementById("cadastroSenhaConf").value;

    if (senha !== confirmarSenha) {
      mostrarAlerta("As senhas não coincidem!");
      return;
    }

    try {
      const response = await fetch("/api/usuarios/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, cpf, email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        mostrarAlerta(data.message || "Erro ao cadastrar aventureiro");
        return;
      }

      mostrarAlerta(
        "Cadastro realizado com sucesso! Faça o login para começar a aventura.",
      );
      abrirPainel("login");
    } catch (error) {
      console.error(error);
      mostrarAlerta("Erro ao conectar com o servidor");
    }
  });
}

if (formLoginPopup) {
  formLoginPopup.addEventListener("submit", async function (e) {
    e.preventDefault();

    const cpf = document.getElementById("loginCpf").value;
    const senha = document.getElementById("loginSenha").value;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cpf, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        mostrarAlerta(data.message || "Erro ao fazer login");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("nome", data.nome);

      const progressoResponse = await fetch("/api/progresso/mapa", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      const progressoData = await progressoResponse.json();

      const modulo1 = progressoData.modulos?.find(function (modulo) {
        return Number(modulo.id_modulo) === 1;
      });

      if (!modulo1 || !modulo1.historia_concluida) {
        window.location.href = "/capitulo1";
      } else {
        window.location.href = "/mapa";
      }
    } catch (error) {
      console.error(error);
      mostrarAlerta("Erro ao conectar com o servidor");
    }
  });
}
