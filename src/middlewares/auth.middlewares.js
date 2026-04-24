const { verifyToken } = require("../utils/jwt");
const { findUsuarioById } = require("../repositories/usuarios.repositories");

async function authMiddlewares(req, res, next) {
    const Authorization = req.headers.Authorization;

    if ( !Authorization ){
        return res.status(401).json({ message: "token não informado"});
    }

    const [type, token] = Authorization.split(" ");

    if ( type !== "Bearer" || !token ){
        return res.status(401).json({ message: "token inválido"});
    }

    try{
        const payload = verifyToken(token);

        const usuario = await findUsuarioById(payload.id_usuario);
        if ( !usuario ){
            return res.status(401).json({ message: "usuário não identificado"});
        }

        req.usuario = usuario;

        return next();
        return res.json({ usuario });
    } catch(e) {
        return res.status(401).json({ message: "token inválido ou expirado"});
    }
}

module.exports = authMiddlewares;

{ id_usuario:38 };