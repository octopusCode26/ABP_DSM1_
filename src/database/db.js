<<<<<<< HEAD
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
    quiet: true,
    path: path.resolve(__dirname, "..", "..", "..", ".env"),
});

const { Pool } = require("pg");

const config = {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: process.env.POSTGRES_PORT,
};

const pool = new Pool (config);

=======
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
    quiet: true,
    path: path.resolve(__dirname, "..", "..", "..", ".env"),
});

const { Pool } = require("pg");

const config = {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: process.env.POSTGRES_PORT,
};

const pool = new Pool (config);

>>>>>>> 8f051a6 (index.html (pagina introdutoria) e css)
module.exports = pool;