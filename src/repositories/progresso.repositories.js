const pool = require("../database/db");

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

async function registrarFalhaDesafio(idUsuario) {
  const progresso = await findProgressoDesafio(idUsuario);

  if (!progresso) {
    return null;
  }

  const novasFalhas = Number(progresso.falhas_no_modulo) + 1;

  if (novasFalhas >= 2) {
    return resetarRunDesafios(idUsuario);
  }

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

async function avancarDesafio(idUsuario) {
  const progresso = await findProgressoDesafio(idUsuario);

  if (!progresso) {
    return null;
  }

  const moduloAtual = Number(progresso.modulo_desafio_atual);

  if (moduloAtual >= 5) {
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

module.exports = {
  concluirHistoria,
  findProgressoMapa,
  findProgressoDesafio,
  resetarRunDesafios,
  registrarFalhaDesafio,
  avancarDesafio,
  historiaConcluida
};