// importando os respectivos arquivos que está dentro de um json
const { Router } = require("express");
const { createUsuario } = require("../repositories/usuarios.repositories");

// importando as respectivas bibliotecas
const router = Router();

// define o cadastro do usuário
router.post("/", async function (req, res) {
  const { nome, email, cpf, senha } = req.body;

  if (!cpf || !nome || !senha) {
    return res
      .status(400)
      .json({ message: "Nome, e-mail e senha são obrigatórios" });
  }

  try {
    const result = await createUsuario(nome, email, cpf, senha);

    res.send(result);
  } catch (e) {
    if (e && e.code == "23505") {
      return res.status(409).json({
        message: "já existe um usuário com os dados informados",
      });
    }

    return res.status(409).json({
        message: "erro interno no servidor",
      });
  }
});

// exporta o "router" para outros arquivos.
module.exports = router;


// ignore o resto.

/*
curl -X POST http://localhost:3000/api \
    -H "Content-Type: application/json" \
    -d '{"nome":"Ana","email":"ana@email.com","cpf":"12345678901","senha":"123","grupo":1}'

curl -X POST http://localhost:3000/api \
    -H "Content-Type: application/json" \
    -d '{"emal":"ana@email.com","cpf":"12345678901","senha":"123","grupo":1}'
*/