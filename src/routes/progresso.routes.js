const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");

const {
  concluirHistoria,
  findProgressoMapa,
} = require("../repositories/progresso.repositories");

const router = Router();

router.get("/mapa", authMiddleware, async function (req, res) {
  try {
    const progresso = await findProgressoMapa(req.usuario.id_usuario);

    return res.status(200).json({
      modulos: progresso.map((modulo) => ({
        id_modulo: modulo.id_modulo,
        titulo: modulo.titulo,
        historia_concluida: modulo.historia_concluida,
        historia_liberada: modulo.id_modulo === 1 || progresso.some(
          (m) => Number(m.id_modulo) === Number(modulo.id_modulo) - 1 && m.historia_concluida
        ),
        questionario_liberado: modulo.historia_concluida,
        desafio_atual: Number(modulo.id_modulo) === Number(modulo.modulo_desafio_atual),
        falhas_no_modulo: modulo.falhas_no_modulo,
        certificado_liberado: modulo.certificado_liberado,
      })),
    });
  } catch (e) {
    return res.status(500).json({
      message: "erro interno do servidor",
    });
  }
});

router.patch("/historia/:idModulo/concluir", authMiddleware, async function (req, res) {
  const idModulo = Number(req.params.idModulo);

  if (!Number.isInteger(idModulo) || idModulo <= 0) {
    return res.status(400).json({
      message: "id do módulo inválido",
    });
  }

  try {
    const progresso = await concluirHistoria(req.usuario.id_usuario, idModulo);

    return res.status(200).json({
      message: "história concluída",
      progresso,
    });
  } catch (e) {
    return res.status(500).json({
      message: "erro interno do servidor",
    });
  }
});

module.exports = router;