// importando os respectivos arquivos que estão dentro de um json.
const { Router } = require("express");

const authService = require("../services/auth.service");

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

  try {

    const resultado = await authService.login(cpf, senha);

    return res.status(200).json(resultado);

  } catch (e) {

    if(e.message === "CPF e senha são obrigatórios"){
      return res.status(400).json({
        message: e.message
      });
    }

    return res.status(500).json({
      message: e.message
    });
  }

});

// exporta o "router" para outros arquivos.
module.exports = router;