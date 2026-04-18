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

// caminhando esses arquivos para as respectivas pastas.
const publicPath = path.join(__dirname, "..", "public");
const pagesPath = path.join(publicPath, "pages");
const assetsPath = path.join(publicPath, "assets");

// define como o site responde às requisições.
app.use("/", express.static(pagesPath));
app.use("/assets", express.static(assetsPath));

app.use("/api", router);

app.use(function(_req,res){
    res.redirect("not-found.html")
});

app.listen(PORT, function(){
    console.log(`Rodando em http://localhost:${PORT}`);
});