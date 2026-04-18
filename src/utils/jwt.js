// cria um token para o usuário.
// essa parte não funciona por enquanto.

// importando as respectivas bibliotecas.
const path = require("path");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

// configura o dotenv manualmente.
dotenv.config({
    quiet: true,
    path: path.resolve(__dirname, "..", "..", ".env"),
});

// cria o Token.
function createToken(payload) {
    return jwt.sign (
        payload,
        process.env.JWT_SECRET,
        {expiresIn: Number(process.env.DEFAULT_EXPIRES_IN_SECONDS)}
    );
}

// exportando a respectiva função para outros arquivos.
module.exports = {
    createToken,
};