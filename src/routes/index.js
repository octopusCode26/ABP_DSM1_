// importando o respectivo arquivos que está dentro de um json.
const { Router } = require("express");

// importando as respectivas bibliotecas.
const usuarios = require("./usuarios.routes");
const auth = require("./auth.routes")
const router = Router();

// agrupa rotas do usuário.
router.use("/usuários", usuarios);

router.use("/auth", auth);

// rota 404, caso a página não for encontrada.
router.use(function(__req,res){
    res.status(404).json({message: "Rota inexistente"});
});

// exporta o "router"(rota) para outros arquivos.
module.exports = router;

// ignore o resto.

// http://localhost:3000/api/usuarios
// http://localhost:3000/api/questoes