// importando os respectivos arquivos que está dentro de um json.
const { Router } = require("express");
const authMiddlewares = require("../middlewares/auth.middlewares");
const { createUsuario, 
        updateUsuarioCpf, 
        findUsuarioById, 
        updateUsuarioNome, 
        updateUsuarioEmail,
        updateUsuarioSenha
} = require("../repositories/usuarios.repositories");

// importando as respectivas bibliotecas.
const router = Router();

// define o cadastro do usuário
router.post("/", async function (req, res) {
  const { nome, email, cpf, senha } = req.body;

  // verifica se as informações estão corretas.
  if (!cpf || !nome || !senha) {
    return res
      .status(400)
      .json({ message: "Nome, e-mail e senha são obrigatórios" });
  }

  // verifica se a senha tem ao menos 6 caracteres.
  if (senha.trim().length < 6) {
    return res
      .status(400)
      .json({ message: "a senha deve ter pelo menos 6 caracteres" });
  }

  // verifica se já existe alguém com os dados informados.
  try {
    const result = await createUsuario(nome, email, cpf, senha);

    res.send(result);
  } catch (e) {
    if (e && e.code == "23505") {
      return res.status(409).json({
        message: "já existe um usuário com os dados informados",
      });
    }

    return res.status(409).json({
      message: "erro interno no servidor",
    });
  }
});

// PATCH /api/usuarios/10/cpf
/*
curl -X PATCH http://localhost:3000/api/usuarios/cpf \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"cpf":"11122233344"}'
*/

router.patch("/cpf", authMiddlewares, async function (req, res) {
  const idUsuario = req.usuario.id_usuario;

  if (!idUsuario) {
    return res.status(400).json({ message: "id_usuario inválido" })
  }

  const { cpf } = req.body;
  if (!cpf) {
    return res.status(400).json({ message: "CPF obrigatório" })
  }

  try {
    const result = await updateUsuarioCpf(idUsuario, cpf);
    if (!result) {
      return res.status(404).json({ message: "usuário não encontrado" })
    }

    const usuario = await findUsuarioById(result.id_usuario);
    return res.status(200).json(usuario);

  } catch (e) {
    if (e && e.code == "23505") {
      return res.status(409).json({
        message: "já existe um usuário com o CPF informado",
      });
    }

    return res.status(409).json({
      message: "erro interno no servidor",
    });
  }
});

/*
curl -X PATCH http://localhost:3000/api/usuarios/nome \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"nome":"Maria"}'
*/

router.patch("/nome", authMiddlewares, async function (req, res) {
  const idUsuario = req.usuario.id_usuario;

  const { nome } = req.body;
  if ( !nome ) {
    return res.status(400).json({ message: "nome é obrigatório" })
  }

  try {
    const result = await updateUsuarioNome(idUsuario, nome);
    if (!result) {
      return res.status(404).json({ message: "usuário não encontrado" })
    }

    const usuario = await findUsuarioById(result.id_usuario);
    return res.status(200).json(usuario);

  } catch (e) {

    return res.status(409).json({
      message: "erro interno no servidor",
    });
  }
});

/*
curl -X PATCH http://localhost:3000/api/usuarios/email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"email":"ana.clara@teste.com"}'
*/

router.patch("/email", authMiddlewares, async function (req, res) {
  const idUsuario = req.usuario.id_usuario;

  const { email } = req.body;
  if ( !email ) {
    return res.status(400).json({ message: "email obrigatório" })
  }

  try {
    const result = await updateUsuarioEmail(idUsuario, email);
    if (!result) {
      return res.status(404).json({ message: "usuário não encontrado" })
    }

    const usuario = await findUsuarioById(result.id_usuario);
    return res.status(200).json(usuario);

  } catch (e) {
    if (e && e.code == "23505") {
      return res.status(409).json({
        message: "já existe um usuário com o e-mail informado",
      });
    }

    return res.status(409).json({
      message: "erro interno no servidor",
    });
  }
});

/*
curl -X PATCH http://localhost:3000/api/usuarios/senha \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"senha":"123aaa"}'
*/

router.patch("/senha", authMiddlewares, async function (req, res) {
  const idUsuario = req.usuario.id_usuario

  if (!idUsuario) {
    return res.status(400).json({ message: "id_usuario inválido" })
  }

  const { senha } = req.body;
  if ( !senha ) {
    return res.status(400).json({ message: "senha obrigatória" })
  }

  if (senha.trim().length < 6) {
    return res
   .status(400)
   .json({ message: "a senha deve ter pelo menos 6 caracteres" });
  }

  try {
    const result = await updateUsuarioSenha(idUsuario, senha);
    if (!result) {
      return res.status(404).json({ message: "usuário não encontrado" })
    }

    const usuario = await findUsuarioById(result.id_usuario);
    return res.status(200).json(usuario);

  } catch (e) {

    return res.status(409).json({
      message: "erro interno no servidor",
    });
  }
});

function getIdUsuario(params) {
  const idUsuario = Number(params.idUsuario);

  if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
    return null;
  }

  return idUsuario;
}

// exporta o "router" para outros arquivos.
module.exports = router;
