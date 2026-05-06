// carrega variáveis de ambiente do arquivo .env
require("dotenv").config();

// importando as respectivas bibliotecas
const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const router = require("./routes");

// mostra o usuário e a senha no pgAdmin no terminal.
console.log({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
});

const PORT = process.env.PORT;
const app = express();

app.use(express.json());

// CONFIGURAÇÃO DO EJS (ADICIONADO)
app.set("view engine", "ejs"); // define o ejs como motor de template

// caminhando esses arquivos para as respectivas pastas.
const publicPath = path.join(__dirname, "..", "public");
const pagesPath = path.join(publicPath, "pages");
const assetsPath = path.join(publicPath, "assets");

// DEFINE A PASTA DE VIEWS COMO public/pages (ADICIONADO)
app.set("views", pagesPath);

// define como o site responde às requisições.
app.use("/assets", express.static(assetsPath));

// ROTA PRINCIPAL USANDO EJS
app.get('/', (req, res)=>{
    res.render('index'); // vai procurar public/pages/index.ejs
});

app.get('/capitulo1', (req, res)=>{
    res.render('capitulo1'); // vai procurar public/pages/capitulo1.ejs
});

app.use("/api", router);

app.use(function (_req, res) {
    res.redirect("not-found.html")
});

app.listen(PORT, function () {
    console.log(`Rodando em http://localhost:${PORT}`);
});