const { Router } = require("express"); 
const {   findCertificadoByHash, } = require("../repositories/certificados.repositories"); 
const authMiddleware = require("../middlewares/auth.middleware");
 
const router = Router(); 

const {
  findDesempenhoCertificado,
} = require("../repositories/certificados.repositories");
 
/* 
curl -X GET http://localhost:3000/api/certificados/hash/HASH_DO_CERTIFICADO 
*/ 
router.get("/hash/:hash", async function (req, res) { 
  const certificadoHash = String(req.params.hash || "").trim(); 
 if (!certificadoHash) { 
    return res.status(400).json({ 
      message: "hash do certificado obrigatório", 
    }); 
  } 
 
  try { 
    const certificado = await findCertificadoByHash(certificadoHash); 
 
    if (!certificado) { 
      return res.status(404).json({ 
        message: "certificado inexistente para o hash informado", 
      }); 
    } 
 
    if (certificado.indisponivel) { 
      return res.status(409).json({ 
        message: certificado.motivo, 
      }); 
    } 
 
    return res.status(200).json(certificado); 
  } catch (e) { 
    return res.status(500).json({ 
      message: "erro interno do servidor", 
    }); 
  } 
}); 

router.get("/desempenho", authMiddleware, async function (req, res) {
  try {
    const desempenho = await findDesempenhoCertificado(
      req.usuario.id_usuario
    );

    return res.status(200).json(desempenho);
  } catch (e) {
    return res.status(500).json({
      message: "erro ao buscar desempenho do certificado",
    });
  }
});

 
module.exports = router;