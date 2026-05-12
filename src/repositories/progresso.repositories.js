// importando as respectivas bibliotecas.
const pool = require("../database/db");

// marca a história de um módulo como concluída.
async function concluirHistoria(idUsuario, idModulo) {
  const result = await pool.query(
    `
    INSERT INTO progresso_historia (
      id_usuario,
      id_modulo,
      concluido,
      concluido_em
    )
    VALUES ($1, $2, true, CURRENT_TIMESTAMP)
    ON CONFLICT (id_usuario, id_modulo)
    DO UPDATE SET
      concluido = true,
      concluido_em = CURRENT_TIMESTAMP
    RETURNING *
    `,
    [idUsuario, idModulo]
  );

  return result.rows[0] || null;
}

// retorna os dados usados no mapa de progresso do usuário.
async function findProgressoMapa(idUsuario) {
  const result = await pool.query(
    `
    SELECT
      m.id_modulo,
      m.titulo,
      COALESCE(ph.concluido, false) AS historia_concluida,
      pd.modulo_desafio_atual,
      pd.falhas_no_modulo,
      pd.certificado_liberado
    FROM modulos m
    CROSS JOIN progresso_desafio pd
    LEFT JOIN progresso_historia ph
      ON ph.id_modulo = m.id_modulo
     AND ph.id_usuario = pd.id_usuario
    WHERE pd.id_usuario = $1
    ORDER BY m.id_modulo ASC
    `,
    [idUsuario]
  );

  return result.rows;
}

// busca o progresso atual da run do usuário.
async function findProgressoDesafio(idUsuario) {
  const result = await pool.query(
    `
    SELECT
      id_usuario,
      modulo_desafio_atual,
      falhas_no_modulo,
      certificado_liberado
    FROM progresso_desafio
    WHERE id_usuario = $1
    LIMIT 1
    `,
    [idUsuario]
  );

  return result.rows[0] || null;
}

// reinicia a run do usuário.
// IMPORTANTE: artefatos do usuário NÃO devem ser removidos no reset da run
async function resetarRunDesafios(idUsuario) {
  const result = await pool.query(
    `
    UPDATE progresso_desafio
    SET
      modulo_desafio_atual = 1,
      falhas_no_modulo = 0,
      certificado_liberado = false,
      atualizado_em = CURRENT_TIMESTAMP
    WHERE id_usuario = $1
    RETURNING *
    `,
    [idUsuario]
  );

  return result.rows[0] || null;
}

// registra uma falha no desafio atual.
async function registrarFalhaDesafio(idUsuario) {
  // busca o progresso atual do usuário.
  const progresso = await findProgressoDesafio(idUsuario);

  if (!progresso) {
    return null;
  }

  // soma mais uma falha.
  const novasFalhas = Number(progresso.falhas_no_modulo) + 1;

  // se chegar em 2 falhas, reinicia a run completa.
  if (novasFalhas >= 2) {
    return resetarRunDesafios(idUsuario);
  }

  // atualiza apenas a quantidade de falhas.
  const result = await pool.query(
    `
    UPDATE progresso_desafio
    SET
      falhas_no_modulo = $2,
      atualizado_em = CURRENT_TIMESTAMP
    WHERE id_usuario = $1
    RETURNING *
    `,
    [idUsuario, novasFalhas]
  );

  return result.rows[0] || null;
}

// avança o usuário para o próximo módulo.
async function avancarDesafio(idUsuario) {
  const progresso = await findProgressoDesafio(idUsuario);

  if (!progresso) {
    return null;
  }

  const moduloAtual = Number(progresso.modulo_desafio_atual);

  // verifica se chegou no último módulo.
  if (moduloAtual >= 5) {

    // libera o certificado.
    const result = await pool.query(
      `
      UPDATE progresso_desafio
      SET
        certificado_liberado = true,
        falhas_no_modulo = 0,
        atualizado_em = CURRENT_TIMESTAMP
      WHERE id_usuario = $1
      RETURNING *
      `,
      [idUsuario]
    );

    return result.rows[0] || null;
  }

  // avança para o próximo módulo.
  const result = await pool.query(
    `
    UPDATE progresso_desafio
    SET
      modulo_desafio_atual = modulo_desafio_atual + 1,
      falhas_no_modulo = 0,
      atualizado_em = CURRENT_TIMESTAMP
    WHERE id_usuario = $1
    RETURNING *
    `,
    [idUsuario]
  );

  return result.rows[0] || null;
}

// verifica se a história de um módulo já foi concluída.
async function historiaConcluida(idUsuario, idModulo) {
  const result = await pool.query(
    `
    SELECT concluido
    FROM progresso_historia
    WHERE id_usuario = $1
      AND id_modulo = $2
    LIMIT 1
    `,
    [idUsuario, idModulo]
  );

  return result.rows[0]?.concluido || false;
}

// exportando as respectivas funções para outros arquivos.
module.exports = {
  concluirHistoria,
  findProgressoMapa,
  findProgressoDesafio,
  resetarRunDesafios,
  registrarFalhaDesafio,
  avancarDesafio,
  historiaConcluida
};