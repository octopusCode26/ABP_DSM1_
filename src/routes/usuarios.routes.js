<<<<<<< HEAD
const { Router } = require("express");
const { createUsuario } = require("../repositories/usuarios.repositories");

const router = Router();

router.post("/", async function (req, res) {
    const { nome, email, cpf, senha } = req.body;

    if (!cpf || !nome || !senha) {
        return res
        .status(400)
        .json({ message: "Nome, e-mail e senha são obrigatórios" });
    }

    const result = await createUsuario(nome, email, cpf, senha);

    res.send(result);
});

module.exports = router;

/*
curl -X POST http://localhost:3000/api \
    -H "Content-Type: application/json" \
    -d '{"nome":"Ana","email":"ana@email.com","cpf":"12345678901","senha":"123","grupo":1}'

curl -X POST http://localhost:3000/api \
    -H "Content-Type: application/json" \
    -d '{"emal":"ana@email.com","cpf":"12345678901","senha":"123","grupo":1}'
=======
const { Router } = require("express");
const { createUsuario } = require("../repositories/usuarios.repositories");

const router = Router();

router.post("/", async function (req, res) {
    const { nome, email, cpf, senha } = req.body;

    if (!cpf || !nome || !senha) {
        return res
        .status(400)
        .json({ message: "Nome, e-mail e senha são obrigatórios" });
    }

    const result = await createUsuario(nome, email, cpf, senha);

    res.send(result);
});

module.exports = router;

/*
curl -X POST http://localhost:3000/api \
    -H "Content-Type: application/json" \
    -d '{"nome":"Ana","email":"ana@email.com","cpf":"12345678901","senha":"123","grupo":1}'

curl -X POST http://localhost:3000/api \
    -H "Content-Type: application/json" \
    -d '{"emal":"ana@email.com","cpf":"12345678901","senha":"123","grupo":1}'
>>>>>>> 8f051a6 (index.html (pagina introdutoria) e css)
*/