document.addEventListener("DOMContentLoaded", function () {

  const botaoCadastro = document.getElementById('ir_cadastro');
  const botaoLogin = document.getElementById('ir_login');
  const painelAuth = document.getElementById('painelAuth');
  const overlayEscuro = document.getElementById('overlayEscuro');
  const botaoFechar = document.getElementById('fecharAuth');
  const formLogin = document.getElementById('formLogin');
  const formCadastro = document.getElementById('formCadastro');

  // FORM CADASTRO
  document
    .getElementById("formCadastroPopup")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const nome = document.getElementById("cadastroNome").value;
      const cpf = document.getElementById("cadastroCpf").value;
      const email = document.getElementById("cadastroEmail").value;
      const senha = document.getElementById("cadastroSenha").value;
      const confirmarSenha = document.getElementById("cadastroSenhaConf").value;

      if (senha !== confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
      }

      try {
        const response = await fetch("/api/usuarios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome,
            cpf,
            email,
            senha,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          window.location.href = "/capitulo1.html";
        } else {
          alert(data.message);
        }

      } catch (error) {
        console.error(error);
        alert("Erro ao conectar com o servidor");
      }
    });

  // FUNÇÃO PARA ABRIR O PAINEL
  function abrirPainel(tipo) {
    painelAuth.style.display = 'block';
    overlayEscuro.style.display = 'block';

    if (tipo === 'login') {
      formLogin.style.display = 'block';
      formCadastro.style.display = 'none';
    } else if (tipo === 'cadastro') {
      formLogin.style.display = 'none';
      formCadastro.style.display = 'block';
    }
  }

  // FECHAR
  function fecharPainel() {
    painelAuth.style.display = 'none';
    overlayEscuro.style.display = 'none';
  }

  // EVENTOS
  botaoCadastro.addEventListener('click', () => abrirPainel('login'));
  botaoLogin.addEventListener('click', () => abrirPainel('cadastro'));
  botaoFechar.addEventListener('click', fecharPainel);
  overlayEscuro.addEventListener('click', fecharPainel);

});