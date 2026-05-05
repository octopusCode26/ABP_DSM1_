const { findProximaQuestaoByUsuario } = require("../repositories/questoes.repositories");
const { Router } = require("express");
const authMiddlewares = require("../middlewares/auth.middlewares");
const router = Router();


/*
curl -X GET http://localhost:3000/api/questoes/proxima-questao \
-H "Authorization: Bearer SEU_TOKEN"
*/

router.get("/proxima-questao", authMiddlewares, async function (req, res) {
  try {
    const questao = await findProximaQuestaoByUsuario(req.usuario.id_usuario);

    if (!questao) {
      return res
        .status(404)
        .json({ message: "nenhuma questão pendente encontrada" });
    }

    return res.status(200).json(questao);
} catch (e) {
return res.status(500).json({
message: "erro interno do servidor",
});
}
});

// exporta o "router" para outros arquivos.
module.exports = router;