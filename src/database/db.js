// importa o Pool de conexões da biblioteca pg.
const { Pool } = require("pg");

// montando um objeto de configuração do banco de dados usando variáveis do .env
const config = {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: process.env.POSTGRES_PORT,
};

console.log(process.env.POSTGRES_DB);

// cria a conexão com o banco usando o pool com as configurações definidas acima.
const pool = new Pool (config);

// exporta o "router" para outros arquivos.
module.exports = pool;