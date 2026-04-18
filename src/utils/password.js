// importando os respectivos arquivos que estão dentro de um json.
const { randomBytes, scryptSync, timingSafeEqual } = require("crypto");

// implementa um hash de senha com salt, usando o módulo crypto do Node.js.
function hashPassword(password) {
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(password, salt, 64).toString("hex");

    return `${salt}:${hash}`;
}

// é a função de verificação de senha.
function verifyPassword(password, storedPassword) {
    const [salt, storedHash] = (storedPassword || "").split(":");

    if (!salt || !storedHash) {
        return false;
    }

    const hash = scryptSync(password, salt, 64);
    const storedHashBuffer = Buffer.from(storedHash, "hex");

    if (hash.length !== storedHashBuffer.length){
        return false;
    }

    return timingSafeEqual(hash, storedHashBuffer);
}

// exportando a respectiva função para outros arquivos.
module.exports = {
    hashPassword,
    verifyPassword,
};