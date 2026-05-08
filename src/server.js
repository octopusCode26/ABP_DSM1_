// carrega variáveis de ambiente do arquivo .env
require("dotenv").config();

// importando as respectivas bibliotecas
const express = require("express");
const path = require("path");

// importa as rotas da API
const router = require("./routes");

// inicializa o express
const app = express();

// permite que o servidor receba JSON no corpo das requisições
app.use(express.json());

// define os caminhos principais do projeto
const publicPath = path.join(__dirname, "..", "public");
const pagesPath = path.join(publicPath, "pages");
const assetsPath = path.join(publicPath, "assets");

// libera a pasta public para arquivos estáticos
app.use(express.static(publicPath));

// libera a pasta assets para CSS, imagens e outros arquivos visuais
app.use("/assets", express.static(assetsPath));

// CONFIGURAÇÃO DO EJS
app.set("view engine", "ejs"); // define o EJS como motor de template

// DEFINE A PASTA DE VIEWS COMO public/pages
app.set("views", pagesPath);

// mostra o usuário e a senha do banco no terminal
console.log({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

// define a porta do servidor
const PORT = process.env.PORT;

// ROTAS DE PÁGINAS EJS

// rota principal
app.get("/", function (_req, res) {
  res.render("index"); // procura public/pages/index.ejs
});

// rota capítulo 1
app.get("/capitulo1", function (_req, res) {
  res.render("capitulo1"); // procura public/pages/capitulo1.ejs
});

// rota do mapa
app.get("/mapa", function (_req, res) {
  res.render("mapa"); // procura public/pages/mapa.ejs
});

// rota para burndown/progresso
app.get("/progresso", function (_req, res) {
  res.render("progresso"); // procura public/pages/progresso.ejs
});

// rota para questionário 1
app.get("/questionario1", function (_req, res) {
  res.render("questionario1"); // procura public/pages/questionario1.ejs
});

// ROTAS DA API
app.use("/api", router);

// rota 404, caso a página não seja encontrada
// IMPORTANTE: sempre deixar por último
app.use(function (_req, res) {
  res.status(404).render("not-found");
});

// inicia o servidor
app.listen(PORT, function () {
  console.log(`Rodando em http://localhost:${PORT}`);
});