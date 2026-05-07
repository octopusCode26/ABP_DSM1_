// carrega variáveis de ambiente do arquivo .env
require("dotenv").config();

// importando as respectivas bibliotecas
const express = require("express");
const path = require("path");
const router = require("./routes");

const PORT = process.env.PORT;
const app = express();

app.use(express.json());

// caminhos para as respectivas pastas
const publicPath = path.join(__dirname, "..", "public");
const pagesPath = path.join(publicPath, "pages");
const assetsPath = path.join(publicPath, "assets");
const imagensQuestoesPath = path.join(
  __dirname, "infra", "init", "seed-data", "imagens"
);

// configura o EJS como motor de views
app.set("view engine", "ejs");
app.set("views", pagesPath);

// define como o site responde às requisições
app.use("/assets", express.static(assetsPath));
app.use("/imagens/questoes", express.static(imagensQuestoesPath));
app.use("/api", router);

// rota principal
app.get("/", function (_req, res) {
  res.render("index");
});

// rota capítulo 1
app.get("/capitulo1", function (_req, res) {
  res.render("capitulo1");
});

// pega-tudo: qualquer rota desconhecida
app.use(function (_req, res) {
  res.status(404).render("not-found");
});

app.listen(PORT, function () {
  console.log(`Rodando em http://localhost:${PORT}`);
});