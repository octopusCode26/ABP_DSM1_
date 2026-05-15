const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  findOutroGrupoAleatorio,
  findQualquerGrupoPorModulo,
  findExameExistente,
  criarExameInicial,
} = require("../repositories/questoes.repositories");

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
        historia_liberada:
        Number(modulo.id_modulo) <= Number(modulo.modulo_desafio_atual),
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
    // 1. conclui a história — igual ao que já tinha
    const progresso = await concluirHistoria(req.usuario.id_usuario, idModulo);

    // 2. verifica se já existe um exame para esse módulo
    // se já existe, não cria outro — evita duplicatas
    const exameExistente = await findExameExistente(req.usuario.id_usuario, idModulo);

    if (!exameExistente) {
      // 3. sorteia um grupo aleatório de questões para esse módulo
      // tenta pegar um grupo que o usuário ainda não usou
      let grupo = await findOutroGrupoAleatorio(req.usuario.id_usuario, idModulo);

      // se não achar (caso raro), pega qualquer grupo disponível
      if (!grupo) {
        grupo = await findQualquerGrupoPorModulo(idModulo);
      }

      // 4. só cria o exame se encontrou um grupo de questões
      if (grupo) {
        await criarExameInicial(req.usuario.id_usuario, idModulo, grupo);
      }
    }

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