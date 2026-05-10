//importando funções

const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const router = Router();
const {
  findProximaQuestaoByUsuario,
  findQuestaoDoExameByUsuario,
  findRespostaByExameEQuestao,
  inserirRespostaQuestao,
  usuarioConcluiuModuloAtual,
  findModuloAtualByUsuario,
  findOutroGrupoAleatorio,
  findProximoModuloByUsuario,
  updateProximaTentativa,
  updateProximoModulo,
  findModulosRespondidosByUsuario,
  findResultadoModuloAtual,
  findQualquerGrupoPorModulo,
} = require("../repositories/questoes.repositories");

const {
  registrarFalhaDesafio,
  avancarDesafio,
  findProgressoDesafio,
  historiaConcluida,
} = require("../repositories/progresso.repositories");

/*
curl -X GET http://localhost:3000/api/questoes/proxima-questao \
-H "Authorization: Bearer SEU_TOKEN"
*/

router.get("/proxima-questao", authMiddleware, async function (req, res) {
  try {
    const progresso = await findProgressoDesafio(req.usuario.id_usuario);

    if (!progresso) {
      return res.status(404).json({
        message: "progresso de desafio não encontrado",
      });
    }

    const historiaLiberada = await historiaConcluida(
      req.usuario.id_usuario,
      progresso.modulo_desafio_atual,
    );

    if (!historiaLiberada) {
      return res.status(403).json({
        message:
          "você precisa concluir a história antes de acessar o desafio deste módulo",
        modulo: progresso.modulo_desafio_atual,
      });
    }
    const questao = await findProximaQuestaoByUsuario(req.usuario.id_usuario);

    if (!questao) {
      return res
        .status(404)
        .json({ message: "nenhuma questão pendente encontrada" });
    }

    return res.status(200).json({
      ...questao,
      imagem: questao.imagem ? `/imagens/questoes/${questao.imagem}` : null,
    });
  } catch (e) {
    return res.status(500).json({
      message: "erro interno do servidor",
    });
  }
});

/* Teste salvando resposta do usuário
curl -X POST http://localhost:3000/api/questoes/responder \ 
  -H "Content-Type: application/json" \ 
  -H "Authorization: Bearer SEU_TOKEN" 
  -d '{"id_exame":"11","id_questao":"21","resposta":"c"}' 
*/

//Sistema de encontrar questões, registrar e checar respostas do usuário
router.post("/responder", authMiddleware, async function (req, res) {
  try {
    console.log("body", req.body);
    const { id_exame, id_questao, resposta } = req.body;

    const respostaNormalizada = resposta.trim().toLowerCase();
    if (!resposta) {
      return res.status(400).json({ message: "resposta obrigatória" });
    }

    const questao = await findQuestaoDoExameByUsuario(
      req.usuario.id_usuario,
      id_exame,
      id_questao,
    );
    if (!questao) {
      return res.status(404).json({
        message: "questão não encontrada para este exame",
      });
    }

    const respostaExistente = await findRespostaByExameEQuestao(
      id_exame,
      id_questao,
    );

    if (respostaExistente) {
      return res.status(409).json({
        message: "questão já respondida",
      });
    }

    const correta = questao.alternativa_correta === respostaNormalizada;
    const nota = correta ? 1 : 0;
    await inserirRespostaQuestao(
      id_exame,
      id_questao,
      respostaNormalizada,
      nota,
    );
    return res.status(201).json({
      correta,
      nota,
      mensagem: correta ? "Resposta correta!" : "Resposta incorreta",
    });
  } catch (e) {
    return res.status(500).json({
      message: "erro interno do servidor",
    });
  }
});

/* implementando próxima tentativa
curl -X PATCH http://localhost:3000/api/questoes/proxima-tentativa \ 
  -H "Authorization: Bearer SEU_TOKEN" 
*/
/*router.patch("/proxima-tentativa", authMiddleware, async function (req, res) {
 try {
    const concluido = await usuarioConcluiuModuloAtual(req.usuario.id_usuario);
    if (!concluido) {
      return res.status(409).json({
        message: "você ainda não concluiu todas as questões do módulo atual",
      });
    }
    
    const modulo = await findModuloAtualByUsuario(req.usuario.id_usuario);
    if (!modulo) {
      return res.status(404).json({
        message: "módulo atual não encontrado",
      });
    }

    if (modulo.tentativa >= 2) {
      return res.status(409).json({
        message: "limite de 2 tentativas atingido",
      });
    }

    const grupo = await findOutroGrupoAleatorio(
      req.usuario.id_usuario,
      modulo.id_modulo,
    );
    if (!grupo) {
      return res.status(404).json({
        message: "nenhum grupo alternativo disponível para este módulo",
      });
    }

    const exame = await updateProximaTentativa(
      modulo.id_exame,
      grupo,
      modulo.tentativa + 1,
    );
    if (!exame) {
      return res.status(404).json({
        message: "exame não encontrado para atualização",
      });
    }

    return res.status(200).json(exame);
  } catch (e) {
    return res.status(500).json({
      message: "erro interno do servidor",
    });
  }
});
 

/* Implementando progressão de módulos
curl -X PATCH http://localhost:3000/api/questoes/proximo-modulo \ 
  -H "Authorization: Bearer SEU_TOKEN" 
*/
router.patch("/proximo-modulo", authMiddleware, async function (req, res) {
  try {
    const idUsuario = req.usuario.id_usuario;

    const concluido = await usuarioConcluiuModuloAtual(idUsuario);

    if (!concluido) {
      return res.status(409).json({
        message: "você ainda não concluiu todas as questões do módulo atual",
      });
    }

    const moduloAtual = await findModuloAtualByUsuario(idUsuario);

    if (!moduloAtual) {
      return res.status(404).json({
        message: "módulo atual não encontrado",
      });
    }

    const resultado = await findResultadoModuloAtual(idUsuario);

    if (!resultado) {
      return res.status(404).json({
        message: "resultado do módulo atual não encontrado",
      });
    }

    const progressoAtual = await findProgressoDesafio(idUsuario);

    if (!progressoAtual) {
      return res.status(404).json({
        message: "progresso de desafio não encontrado",
      });
    }

    if (
      Number(resultado.id_modulo) !==
      Number(progressoAtual.modulo_desafio_atual)
    ) {
      return res.status(409).json({
        message: "este questionário não corresponde ao desafio atual da run",
        desafio_atual: progressoAtual.modulo_desafio_atual,
        modulo_resultado: resultado.id_modulo,
      });
    }

    if (!resultado.aprovado) {
      const progressoAntes = await findProgressoDesafio(idUsuario);

      const progresso = await registrarFalhaDesafio(idUsuario);

      const resetouRun =
        progresso &&
        Number(progresso.modulo_desafio_atual) === 1 &&
        Number(progresso.falhas_no_modulo) === 0 &&
        Number(progressoAntes.falhas_no_modulo) >= 1;

      if (resetouRun) {
        let grupoReset = await findOutroGrupoAleatorio(idUsuario, 1);

        if (!grupoReset) {
          grupoReset = await findQualquerGrupoPorModulo(1);
        }

        if (!grupoReset) {
          return res.status(404).json({
            message:
              "nenhum grupo de questões encontrado para reiniciar o módulo 1",
          });
        }

        const exameResetado = await updateProximoModulo(
          moduloAtual.id_exame,
          1,
          grupoReset,
          1,
        );

        return res.status(200).json({
          aprovado: false,
          resetou_run: true,
          message:
            "Você falhou 2 vezes. Sua run foi reiniciada para o módulo 1.",
          percentual: resultado.percentual,
          nota_minima: 70,
          exame: exameResetado,
          progresso,
        });
      }
      let grupoNovaTentativa = await findOutroGrupoAleatorio(
        idUsuario,
        resultado.id_modulo,
      );

      if (!grupoNovaTentativa) {
        grupoNovaTentativa = await findQualquerGrupoPorModulo(
          resultado.id_modulo,
        );
      }

      if (!grupoNovaTentativa) {
        return res.status(404).json({
          message: "nenhum grupo de questões encontrado para este módulo",
        });
      }

      const novaTentativa = await updateProximaTentativa(
        moduloAtual.id_exame,
        grupoNovaTentativa,
        Number(moduloAtual.tentativa) + 1,
      );

      return res.status(200).json({
        aprovado: false,
        resetou_run: false,
        message: "nota mínima não atingida. Você recebeu mais uma tentativa.",
        percentual: resultado.percentual,
        nota_minima: 70,
        exame: novaTentativa,
        progresso,
      });
    }

    const proximoModulo = await findProximoModuloByUsuario(idUsuario);

    if (!proximoModulo) {
      const progresso = await avancarDesafio(idUsuario);

      return res.status(200).json({
        aprovado: true,
        certificado_liberado: true,
        message: "você concluiu todos os módulos",
        progresso,
      });
    }

    let grupo = await findOutroGrupoAleatorio(idUsuario, proximoModulo);

if (!grupo) {
  grupo = await findQualquerGrupoPorModulo(proximoModulo);
}

if (!grupo) {
  return res.status(404).json({
    message: "nenhum grupo de questões encontrado para o próximo módulo",
  });
}

const exame = await updateProximoModulo(
  moduloAtual.id_exame,
  proximoModulo,
  grupo,
  1,
);

const progresso = await avancarDesafio(idUsuario);

    return res.status(200).json({
      aprovado: true,
      message: "desafio concluído com sucesso",
      exame,
      progresso,
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      message: "erro interno do servidor",
    });
  }
});

/* Acompanhar progresso
curl -X GET http://localhost:3000/api/questoes/modulos-respondidos \ 
  -H "Authorization: Bearer SEU_TOKEN" 
*/
router.get("/modulos-respondidos", authMiddleware, async function (req, res) {
  try {
    const modulos = await findModulosRespondidosByUsuario(
      req.usuario.id_usuario,
    );

    return res.status(200).json(modulos);
  } catch (e) {
    return res.status(500).json({
      message: "erro interno do servidor",
    });
  }
});

router.get("/resultado-atual", authMiddleware, async function (req, res) {
  try {
    const resultado = await findResultadoModuloAtual(req.usuario.id_usuario);

    if (!resultado) {
      return res.status(404).json({
        message: "resultado atual não encontrado",
      });
    }

    return res.status(200).json(resultado);
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      message: "erro interno do servidor",
    });
  }
});

// exporta o "router" para outros arquivos.
module.exports = router;
