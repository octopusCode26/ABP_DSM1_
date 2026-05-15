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

// libera as imagens das questões
app.use(
  "/assets/img/questoes",
  express.static(path.join(__dirname, "infra", "init", "seed-data", "imagens")),
);

// libera a pasta assets para CSS, imagens e outros arquivos visuais
app.use("/assets", express.static(assetsPath));

// CONFIGURAÇÃO DO EJS
app.set("view engine", "ejs"); // define o EJS como motor de template

// DEFINE A PASTA DE VIEWS COMO public/pages
app.set("views", pagesPath);

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

// rota custom (temporária para validar o layout novo)
app.get("/mapa-custom", function (_req, res) {
  res.render("mapa-custom");
});

// rota custom 2 (alternativa descartavel para validar painel de acoes)
app.get("/mapa-custom-2", function (_req, res) {
  res.render("mapa-custom-2");
});

// rota para burndown/progresso
app.get("/burningdown", function (_req, res) {
  res.render("burningdown"); // procura public/pages/burningdown.ejs
});

app.get("/desafio1", function (_req, res) {
  res.render("desafio1");
});

// rota para questionário 1
app.get("/questionario1", function (_req, res) {
  res.render("questionario1"); // procura public/pages/questionario1.ejs
});

app.get("/questionario", function (_req, res) {
  res.render("questionario1");
});

app.get("/resultado", function (_req, res) {
  res.render("resultado");
});

app.get("/artefatos", function (_req, res) {
  res.render("not-found");
});

app.get("/perfil", function (_req, res) {
  res.render("not-found");
});

// rota para certificado
app.get("/certificado", function (_req, res) {
  res.render("certificado"); // procura public/pages/certificado.ejs
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
