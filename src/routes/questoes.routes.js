//importando funções

const { Router } = require("express");
const authMiddlewares = require("../middlewares/auth.middlewares");
const router = Router();
const {
  findProximaQuestaoByUsuario,
  findQuestaoDoExameByUsuario,
  findRespostaByExameEQuestao,
  inserirRespostaQuestao,
  usuarioConcluiuModuloAtual,
  findModuloAtualByUsuario,
  findOutroGrupoAleatorio,
  updateProximaTentativa,
} = require("../repositories/questoes.repositories");

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

/* Teste salvando resposta do usuário
curl -X POST http://localhost:3000/api/questoes/responder \ 
  -H "Content-Type: application/json" \ 
  -H "Authorization: Bearer SEU_TOKEN" 
  -d '{"id_exame":"11","id_questao":"21","resposta":"c"}' 
*/

//Sistema de encontrar questões, registrar e checar respostas do usuário
router.post("/responder", authMiddlewares, async function (req, res) {
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
router.patch("/proxima-tentativa", authMiddlewares, async function (req, res) {
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

// exporta o "router" para outros arquivos.
module.exports = router;
