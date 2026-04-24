<<<<<<< HEAD
const pool = require("../database/db");
const { randomBytes } = require("crypto");

async function insertUsuario(client, nome, email, cpf, senha) {
    const certificado_hash = randomBytes(24).toString("hex");

    const result = await client.query(
        `INSERT INTO usuarios (nome, email, cpf, senha, certificado_hash)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id_usuario, nome, email, cpf, certificado_hash`,
        [nome, email, cpf, senha, certificado_hash]
    );
    if (result && result.rowCount == 1) {
        return result.rows[0]
    };
    return null;
};

async function findPrimeiroModuloId(client){
    const result = await client.query(`SELECT id_modulo FROM modulos ORDER BY id_modulo LIMIT 1`);
    if( result && result.rows.length == 1){
        return result.rows[0];
    }
    return null;
};

async function createUsuario(nome, email, cpf, senha) {
    const client = await pool.connect();
    await client.query("BEGIN");

    const usuario = await insertUsuario(client, nome, email, cpf, senha)
    if (!usuario) {
        await client.query("ROLLBACK");
        return { message: "Problemas ao criar o usuário" }
    }
    const modulo = await findPrimeiroModuloId(client);
    if( !modulo ){
        await client.query("ROLLBACK");
        return { message: "Problemas ao obter o primeiro módulo"};
    }
    console.log("id_modulo:", modulo);

    await client.query("COMMIT");
    client.release();

    return usuario
};

module.exports = {
    createUsuario
=======
const pool = require("../database/db");
const { randomBytes } = require("crypto");

async function insertUsuario(client, nome, email, cpf, senha) {
    const certificado_hash = randomBytes(24).toString("hex");

    const result = await client.query(
        `INSERT INTO usuarios (nome, email, cpf, senha, certificado_hash)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id_usuario, nome, email, cpf, certificado_hash`,
        [nome, email, cpf, senha, certificado_hash]
    );
    if (result && result.rowCount == 1) {
        return result.rows[0]
    };
    return null;
};

async function findPrimeiroModuloId(client){
    const result = await client.query(`SELECT id_modulo FROM modulos ORDER BY id_modulo LIMIT 1`);
    if( result && result.rows.length == 1){
        return result.rows[0];
    }
    return null;
};

async function createUsuario(nome, email, cpf, senha) {
    const client = await pool.connect();
    await client.query("BEGIN");

    const usuario = await insertUsuario(client, nome, email, cpf, senha)
    if (!usuario) {
        await client.query("ROLLBACK");
        return { message: "Problemas ao criar o usuário" }
    }
    const modulo = await findPrimeiroModuloId(client);
    if( !modulo ){
        await client.query("ROLLBACK");
        return { message: "Problemas ao obter o primeiro módulo"};
    }
    console.log("id_modulo:", modulo);

    await client.query("COMMIT");
    client.release();

    return usuario
};

module.exports = {
    createUsuario
>>>>>>> 8f051a6 (index.html (pagina introdutoria) e css)
};