// importando os respectivos arquivos que estão dentro de um json.
const { Router } = require("express");
const {
  findUsuarioByCpfAndSenha,
} = require("../repositories/usuarios.repositories");
const { createToken } = require("../utils/jwt");

/* 
curl -X POST http://localhost:3000/api/auth/login\
  -H "Content-Type: application/json" \
  -d '{"cpf":"11122233344","senha":"123456"}'
*/

// importando a rota para esse arquivo.
const router = Router();

// implementa a rota de login.
router.post("/login", async function (req, res) {
  const { cpf, senha } = req.body;

  // caso o cpf ou senha sejam diferentes do banco de dados, será recusado.
  if (!cpf || !senha) {
    return res.status(400).json({ message: "CPF e senha são obrigatórios" });
  }

  // cria um token de autenticação.
  try {
    const result = await findUsuarioByCpfAndSenha(cpf, senha);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
});

// exporta o "router" para outros arquivos.
module.exports = router;

// ignore o resto.

/* 
curl -X POST http://localhost:3000/api/auth/login\
  -H "Content-Type: application/json" \
  -d '{"cpf":"11122233344","senha":"123456"}'
*/

/* 
    const usuario = await findUsuarioByCpfAndSenha(cpf, senha);
    const token = createToken({ id_usuario: usuario.id_usuario });
    return res.status(200).json({
      token,
      nome: usuario.nome,
    });
*/