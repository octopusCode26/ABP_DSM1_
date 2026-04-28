// importando os respectivos arquivos que estão dentro de um json.
const {
  findUsuarioByCpfAndSenha,
} = require("../repositories/usuarios.repositories");

const { createToken } = require("../utils/jwt");


async function login(cpf, senha){

  // caso o cpf ou senha sejam diferentes do banco de dados, será recusado.
  if (!cpf || !senha) {
    throw new Error("CPF e senha são obrigatórios");
  }

  // cria um token de autenticação.
  const usuario = await findUsuarioByCpfAndSenha(cpf, senha);

  const token = createToken({
    id_usuario: usuario.id_usuario
  });

  return {
    token,
    nome: usuario.nome
  };
}

module.exports = {
  login
};