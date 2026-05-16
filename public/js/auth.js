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
      // cadastro
      const cadastroResponse = await fetch("/api/usuarios/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, cpf, email, senha }),
      });

      const cadastroData = await cadastroResponse.json();

      if (!cadastroResponse.ok) {
        mostrarAlerta(cadastroData.message || "Erro ao cadastrar aventureiro");
        return;
      }

      // login automático após cadastro
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cpf, senha }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        mostrarAlerta(loginData.message || "Erro ao fazer login automático");
        return;
      }

      // salva autenticação
      localStorage.setItem("token", loginData.token);
      localStorage.setItem("nome", loginData.nome);

      mostrarAlerta("Cadastro realizado com sucesso!");

      // primeiro acesso -> capítulo 1
      // demais acessos -> mapa
      if (loginData.primeiro_acesso) {
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

      console.log(data);

      if (!response.ok) {
        mostrarAlerta(data.message || "Erro ao fazer login");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("nome", data.nome);

      // primeiro acesso -> capítulo 1
      // demais acessos -> mapa
      if (data.primeiro_acesso) {
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

// -------- MÁSCARA DE CPF --------
// formata automaticamente enquanto o usuário digita
// remove tudo que não é número e adiciona . e - nas posições certas
function aplicarMascaraCpf(input) {
  // pega só os números do que foi digitado
  let valor = input.value.replace(/\D/g, "");

  // limita a 11 dígitos (tamanho do CPF)
  valor = valor.slice(0, 11);

  // adiciona a formatação conforme o usuário digita
  // ex: 123 -> 123
  // ex: 1234 -> 123.4
  // ex: 12345678901 -> 123.456.789-01
  if (valor.length > 9) {
    valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
  } else if (valor.length > 6) {
    valor = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
  } else if (valor.length > 3) {
    valor = valor.replace(/(\d{3})(\d{1,3})/, "$1.$2");
  }

  input.value = valor;
}

// aplica a máscara em todos os inputs de CPF da página
document.querySelectorAll("#cadastroCpf, #loginCpf").forEach(function (input) {
  input.addEventListener("input", function () {
    aplicarMascaraCpf(input);
  });
});

// -------- PLACEHOLDER DINÂMICO DA SENHA --------
// troca o placeholder quando o input ganha foco
// assim não polui visualmente quando está vazio
document
  .querySelectorAll("#cadastroSenha, #loginSenha")
  .forEach(function (input) {
    input.setAttribute("placeholder", "Mínimo 6 caracteres");
  });
