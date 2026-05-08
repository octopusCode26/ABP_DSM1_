const pool = require("../database/db");

/*pega o exame mais recente do usuário, filtra as questões do mesmo id_modulo e grupo,
exclui as que já têm registro em respostas para aquele exame e retorna a próxima
por ordem de numero e id_questao.*/

async function findProximaQuestaoByUsuario(idUsuario) {

  const result = await pool.query(
    `
WITH progresso AS (
  SELECT modulo_desafio_atual
  FROM progresso_desafio
  WHERE id_usuario = $1
  LIMIT 1
),

exame_atual AS (
  SELECT
    e.id_exame,
    e.id_modulo,
    e.grupo
  FROM exames e

  INNER JOIN progresso p
    ON p.modulo_desafio_atual = e.id_modulo

  WHERE e.id_usuario = $1

  ORDER BY e.id_exame DESC
  LIMIT 1
)

SELECT
  e.id_exame,
  q.id_questao,
  q.id_modulo,
  q.grupo,
  q.numero,
  q.dificuldade,
  q.enunciado,
  q.alternativa_a,
  q.alternativa_b,
  q.alternativa_c,
  q.alternativa_d,
  q.imagem

FROM exame_atual e

INNER JOIN questoes q
  ON q.id_modulo = e.id_modulo
 AND q.grupo IS NOT DISTINCT FROM e.grupo

WHERE NOT EXISTS (
  SELECT 1
  FROM respostas r
  WHERE r.id_exame = e.id_exame
    AND r.id_questao = q.id_questao
)

ORDER BY q.numero ASC NULLS LAST, q.id_questao ASC
LIMIT 1
`,
    [idUsuario]
  );

  return result.rows[0] || null;
}

async function findQuestaoDoExameByUsuario(idUsuario, idExame, idQuestao) {
  const result = await pool.query(
    `
SELECT
e.id_exame,
q.id_questao,
q.alternativa_correta
FROM exames e
INNER JOIN questoes q
ON q.id_modulo = e.id_modulo
AND q.grupo IS NOT DISTINCT FROM e.grupo
WHERE e.id_usuario = $1
AND e.id_exame = $2
AND q.id_questao = $3
LIMIT 1
`,
    [idUsuario, idExame, idQuestao],
  );
  return result.rows[0] || null;
}

async function findRespostaByExameEQuestao(idExame, idQuestao) {
  const result = await pool.query(
    `
    SELECT
    id_resposta,
    id_exame,
    id_questao,
    resposta,
    nota,
    respondido_em 
  FROM respostas
  WHERE id_exame = $1
  AND id_questao = $2
  LIMIT 1
`,
    [idExame, idQuestao],
  );
  return result.rows[0] || null;
}

async function inserirRespostaQuestao(id_exame, id_questao, resposta, nota) {
  const result = await pool.query(
    `
    INSERT INTO respostas (id_exame, id_questao, nota, resposta)
    VALUES ($1,$2,$3,$4)
    RETURNING id_resposta, id_exame, id_questao, nota
   `,
    [id_exame, id_questao, nota, resposta],
  );
  console.log("result", result);
  return result.rows[0];
}

//checagem se o usuário concluiu módulo 

async function usuarioConcluiuModuloAtual(idUsuario) {
  const result = await pool.query(
    ` 
    WITH exame_atual AS ( 
      SELECT 
        id_exame, 
        id_modulo, 
        grupo 
      FROM exames 
      WHERE id_usuario = $1 
      ORDER BY id_exame DESC 
      LIMIT 1
 ) 
    SELECT NOT EXISTS ( 
      SELECT 1 
      FROM exame_atual e 
      INNER JOIN questoes q 
        ON q.id_modulo = e.id_modulo 
       AND q.grupo IS NOT DISTINCT FROM e.grupo 
      WHERE NOT EXISTS ( 
        SELECT 1 
        FROM respostas r 
        WHERE r.id_exame = e.id_exame 
          AND r.id_questao = q.id_questao 
      ) 
    ) AS concluido 
    `,
    [idUsuario],
  );

  return result.rows[0]?.concluido || false;
}

async function findModuloAtualByUsuario(idUsuario) {

  const result = await pool.query(
    `
    WITH progresso AS (
      SELECT modulo_desafio_atual
      FROM progresso_desafio
      WHERE id_usuario = $1
      LIMIT 1
    )

    SELECT
      e.id_exame,
      e.id_modulo,
      m.titulo,
      e.grupo,
      e.tentativa
    FROM exames e

    INNER JOIN modulos m
      ON m.id_modulo = e.id_modulo

    INNER JOIN progresso p
      ON p.modulo_desafio_atual = e.id_modulo

    WHERE e.id_usuario = $1

    ORDER BY e.id_exame DESC
    LIMIT 1
    `,
    [idUsuario]
  );

  return result.rows[0] || null;
}

//gera um novo grupo de questões, para segunda tentativa.

async function findOutroGrupoAleatorio(idUsuario, idModulo) { 
  const result = await pool.query( 
    ` 
    SELECT q.grupo 
    FROM questoes q 
    WHERE q.id_modulo = $1 
      AND q.grupo IS NOT NULL 
      AND q.grupo NOT IN ( 
        SELECT e.grupo 
        FROM exames e 
        WHERE e.id_usuario = $2 
          AND e.id_modulo = $1 
          AND e.grupo IS NOT NULL 
      ) 
    GROUP BY q.grupo 
    ORDER BY RANDOM() 
    LIMIT 1 
    `, 
    [idModulo, idUsuario], 
  ); 
 
  return result.rows[0]?.grupo || null; 
}

//atualizar próxima tentativa
async function updateProximaTentativa(idExame, grupo, tentativa) {

  // pega dados do exame atual
  const exameAtual = await pool.query(
    `
    SELECT
      id_modulo,
      id_usuario
    FROM exames
    WHERE id_exame = $1
    LIMIT 1
    `,
    [idExame]
  );

  const exame = exameAtual.rows[0];

  if (!exame) {
    return null;
  }

  // cria NOVO exame para nova tentativa
  const result = await pool.query(
    `
    INSERT INTO exames (
      id_modulo,
      id_usuario,
      grupo,
      tentativa
    )
    VALUES ($1, $2, $3, $4)
    RETURNING
      id_exame,
      id_modulo,
      id_usuario,
      grupo,
      tentativa
    `,
    [
      exame.id_modulo,
      exame.id_usuario,
      grupo,
      tentativa
    ]
  );

  return result.rows[0] || null;
}

//Encontra o próximo módulo:
async function findProximoModuloByUsuario(idUsuario) { 
  const result = await pool.query( 
    ` 
    WITH modulo_atual AS ( 
      SELECT id_modulo 
      FROM exames 
      WHERE id_usuario = $1 
      ORDER BY id_exame DESC 
      LIMIT 1 
    ) 
    SELECT 
      m.id_modulo, 
      m.titulo 
    FROM modulos m 
    INNER JOIN modulo_atual ma 
      ON m.id_modulo > ma.id_modulo 
    ORDER BY m.id_modulo ASC 
    LIMIT 1 
    `, 
    [idUsuario], 
  ); 
 
  return result.rows[0]?.id_modulo || null; 
}

//atualizar próximo módulo
async function updateProximoModulo(idExame, modulo, grupo, tentativa) {
  const exameAtual = await pool.query(
    `
    SELECT id_usuario
    FROM exames
    WHERE id_exame = $1
    LIMIT 1
    `,
    [idExame]
  );

  const exame = exameAtual.rows[0];

  if (!exame) {
    return null;
  }

  const result = await pool.query(
    `
    INSERT INTO exames (
      id_modulo,
      id_usuario,
      grupo,
      tentativa
    )
    VALUES ($1, $2, $3, $4)
    RETURNING
      id_exame,
      id_modulo,
      id_usuario,
      grupo,
      tentativa
    `,
    [modulo, exame.id_usuario, grupo, tentativa]
  );

  return result.rows[0] || null;
}

//Implementação de consulta de progresso do usuário
async function findModulosRespondidosByUsuario(idUsuario) { 
  const result = await pool.query( 
    ` 
    WITH tentativas AS ( 
      SELECT 
        q.id_modulo, 
        q.grupo, 
        MIN(r.respondido_em) AS inicio, 
        MAX(r.respondido_em) AS fim, 
        COUNT(DISTINCT r.id_questao)::INTEGER AS questoes_respondidas, 
        COALESCE(SUM(r.nota), 0)::INTEGER AS nota 
      FROM respostas r 
      INNER JOIN exames e 
        ON e.id_exame = r.id_exame 
      INNER JOIN questoes q 
        ON q.id_questao = r.id_questao
          WHERE e.id_usuario = $1 
      GROUP BY 
        q.id_modulo, 
        q.grupo 
    ) 
    SELECT 
      t.id_modulo, 
      t.inicio, 
      t.fim, 
      t.questoes_respondidas, 
      COUNT(q.id_questao)::INTEGER AS questoes, 
      t.nota, 
      ROW_NUMBER() OVER ( 
        PARTITION BY t.id_modulo 
        ORDER BY t.inicio ASC 
      )::INTEGER AS tentativa 
    FROM tentativas t 
    INNER JOIN questoes q 
      ON q.id_modulo = t.id_modulo 
     AND q.grupo IS NOT DISTINCT FROM t.grupo 
    GROUP BY 
      t.id_modulo, 
      t.grupo, 
      t.inicio, 
      t.fim, 
      t.questoes_respondidas, 
      t.nota 
    ORDER BY 
      t.id_modulo ASC, 
      tentativa ASC 
    `, 
    [idUsuario], 
  ); 
 
  return result.rows; 
} 

async function findResultadoModuloAtual(idUsuario) {

  const result = await pool.query(
    `
    WITH progresso AS (
      SELECT modulo_desafio_atual
      FROM progresso_desafio
      WHERE id_usuario = $1
      LIMIT 1
    ),

    exame_atual AS (
      SELECT
        e.id_exame,
        e.id_modulo,
        e.tentativa
      FROM exames e

      INNER JOIN progresso p
        ON p.modulo_desafio_atual = e.id_modulo

      WHERE e.id_usuario = $1

      ORDER BY e.id_exame DESC
      LIMIT 1
    )

    SELECT
      e.id_exame,
      e.id_modulo,
      e.tentativa,
      COUNT(r.id_resposta)::INTEGER AS total_respondidas,
      COALESCE(SUM(r.nota), 0)::INTEGER AS acertos,

      ROUND(
        (
          COALESCE(SUM(r.nota), 0)::numeric /
          NULLIF(COUNT(r.id_resposta), 0)
        ) * 100,
        2
      ) AS percentual

    FROM exame_atual e

    LEFT JOIN respostas r
      ON r.id_exame = e.id_exame

    GROUP BY
      e.id_exame,
      e.id_modulo,
      e.tentativa
    `,
    [idUsuario]
  );

  const row = result.rows[0];

  if (!row) return null;

  return {
    id_exame: row.id_exame,
    id_modulo: row.id_modulo,
    tentativa: row.tentativa,
    total_respondidas: row.total_respondidas,
    acertos: row.acertos,
    percentual: Number(row.percentual),
    aprovado: Number(row.percentual) >= 70
  };
}

module.exports = {
  findProximaQuestaoByUsuario,
  findQuestaoDoExameByUsuario,
  findRespostaByExameEQuestao,
  inserirRespostaQuestao,
  usuarioConcluiuModuloAtual,
  findModuloAtualByUsuario,
  findOutroGrupoAleatorio,
  updateProximaTentativa,
  findProximoModuloByUsuario,
  updateProximoModulo,
  findModulosRespondidosByUsuario,
  findResultadoModuloAtual
};
