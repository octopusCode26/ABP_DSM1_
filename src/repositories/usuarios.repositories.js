// importando as respectivas bibliotecas.
const pool = require("../database/db");

// importando o respectivo arquivos que está dentro de um json.
const { randomBytes } = require("crypto");
const { hashPassword } = require("../utils/password");

// insere um novo usuário no banco de dados (pgAdmin).
async function insertUsuario(client, nome, email, cpf, senha) {
  const certificado_hash = randomBytes(24).toString("hex");
  const senhaCodificada = hashPassword(senha);

  const result = await client.query(
    `INSERT INTO usuarios (nome, email, cpf, senha, certificado_hash)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id_usuario, nome, email, cpf, certificado_hash`,
    [nome, email, cpf, senhaCodificada, certificado_hash]
  );

  return result.rows[0] || null;
}

// busca o primeiro módulo no banco de dados (pgAdmin).
async function findPrimeiroModuloId(client) {
  const result = await client.query(
    `SELECT id_modulo FROM modulos ORDER BY id_modulo LIMIT 1`
  );

  return result.rows[0] || null;
}

// pega um grupo aleatório de questões dentro de um módulo no banco (pgAdmin).
async function findGrupoAleatorio(client, idModulo) {
  const result = await client.query(
    `SELECT grupo 
         FROM questoes
         WHERE id_modulo=$1 AND grupo IS NOT null
         GROUP BY grupo
         ORDER BY RANDOM()
         LIMIT 1`,
    [idModulo]
  );

  return result.rows[0] || null;
}

// insere um exame no banco de dados(pgAdmin). 
async function insertExame(client, idModulo, idUsuario, grupo, tentativa) {
  const result = await client.query(
    `INSERT INTO exames (id_modulo, id_usuario, grupo, tentativa)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id_exame`,
    [client, idModulo, idUsuario, grupo, tentativa]
  );
}

// fluxo completo de criação de usuário + criação de exame inicial.
async function createUsuario(nome, email, cpf, senha) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const usuario = await insertUsuario(client, nome, email, cpf, senha);
    if (!usuario) {
      await client.query("ROLLBACK");
      return { error: "Problemas ao criar o usuário" };
    }
    const modulo = await findPrimeiroModuloId(client);
    if (!modulo) {
        throw new Error("Nenhum módulo cadastrado para inicialiar exame do usuário");
    }

    const grupo = await findGrupoAleatorio(client, modulo.id_modulo);
    if (!grupo) {
        throw new Error("Nenhum grupo cadastrado para inicialiar exame do usuário");
    }

    await insertExame(
      client,
      modulo.id_modulo,
      usuario.id_usuario,
      grupo.grupo,
      1
    );

    console.log("R:", usuario.id_usuario, modulo.id_modulo, grupo.grupo);

    await client.query("COMMIT");

    return { id_usuario: usuario.id_usuario, nome: usuario.nome, email: usuario.email, cpf: usuario.cpf };
  } catch (e) {
    client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

async function updateUsuarioCpf(idUsuario, cpf) {
  const result = await pool.query(
    `
    UPDATE usuarios
    SET cpf = $1
    WHERE id_usuario = $2
    RETURNING id_usuario
    `,
    [cpf, idUsuario],
  );

  return result.rows[0] || null;
}

async function updateUsuarioNome(idUsuario, nome) {
  const result = await pool.query(
    `
    UPDATE usuarios
    SET nome = $1
    WHERE id_usuario = $2
    RETURNING id_usuario
    `,
    [nome, idUsuario],
  );

  return result.rows[0] || null;
}

async function updateUsuarioEmail(idUsuario, email) {
  const result = await pool.query(
    `
    UPDATE usuarios
    SET email = $1
    WHERE id_usuario = $2
    RETURNING id_usuario
    `,
    [email, idUsuario],
  );

  return result.rows[0] || null;
}

async function updateUsuarioSenha(idUsuario, senha) {
  const senhaCodificada = hashPassword(senha);
  const result = await pool.query(
    `
    UPDATE usuarios
    SET senha = $1
    WHERE id_usuario = $2
    RETURNING id_usuario
    `,
    [senhaCodificada, idUsuario],
  );

  return result.rows[0] || null;
}

async function findUsuarioById(idUsuario) {
  const result = await pool.query(
    `
    SELECT id_usuario, nome, email, cpf
    FROM usuarios
    WHERE id_usuario = $1
    `,
    [idUsuario],
  );

  return result.rows[0] || null;
}

async function findUsuarioByCpfAndSenha(cpf, senha){
  const result = await pool.query(
    `
    SELECT id_usuario, nome, email, cpf, senha
    FROM usuarios
    WHERE cpf = $1
    `,
    [cpf],
  );

  const usuario = result.rows[0];

  if ( !usuario ){
    throw new Error("usuário inexistente");
  }

  const senhaValida = verifyPassword(senha, usuario.senha);
  if ( !senhaValida ){
    throw new Error("dados de login incorretos");
  }

  return {
    id_usuario: usuario.id_usuario, 
    nome: usuario.nome, 
    email: usuario.email, 
    cpf: usuario.cpf
  }

}

// exportando a respectiva função para outros arquivos.
module.exports = {
  createUsuario,
  updateUsuarioCpf,
  findUsuarioById,
  updateUsuarioNome,
  updateUsuarioEmail,
  updateUsuarioSenha,
  findUsuarioByCpfAndSenha
};