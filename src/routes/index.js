// importando o respectivo arquivos que está dentro de um json.
const { Router } = require("express");

// importando as respectivas bibliotecas.
const usuarios = require("./usuarios.routes");
const questoes = require("./questoes.routes");
const auth = require("./auth.routes")
const certificados = require("./certificados.routes");
const progresso = require("./progresso.routes");
const navbarRoutes = require('./navbar.routes');
const router = Router();

// agrupa rotas do usuário.
router.use("/auth", auth);

router.use("/usuarios", usuarios);
router.use("/questoes", questoes);
router.use("/certificados", certificados);
router.use("/progresso", progresso);
router.use('/navbar', navbarRoutes);

// rota 404, caso a página não for encontrada.
router.use(function(__req,res){
    res.status(404).json({message: "Rota inexistente"});
});

// exporta o "router"(rota) para outros arquivos.
module.exports = router;

// ignore o resto.

// http://localhost:3000/api/usuarios
// http://localhost:3000/api/questoes
