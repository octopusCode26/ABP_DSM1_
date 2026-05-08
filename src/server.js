// carrega variáveis de ambiente do arquivo .env
require("dotenv").config();

// importando as respectivas bibliotecas
const express = require("express");
const app = express();
const path = require("path");
const router = require("./routes");

app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

// CONFIGURAÇÃO DO EJS (ADICIONADO)
app.set("view engine", "ejs"); // define o ejs como motor de template

// mostra o usuário e a senha no pgAdmin no terminal.
console.log({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
});

const PORT = process.env.PORT;


// caminhando esses arquivos para as respectivas pastas.
const publicPath = path.join(__dirname, "..", "public");
const pagesPath = path.join(publicPath, "pages");
const assetsPath = path.join(publicPath, "assets");

// DEFINE A PASTA DE VIEWS COMO public/pages (ADICIONADO)
app.set("views", pagesPath);

// define como o site responde às requisições.
app.use("/assets", express.static(assetsPath));

// ROTA PRINCIPAL USANDO EJS
app.get('/', (__req, res)=>{
  res.render('index'); // vai procurar public/pages/index.ejs
});

app.get('/capitulo1', (__req, res)=>{
  res.render('capitulo1'); // vai procurar public/pages/capitulo1.ejs
});

app.use("/api", router);

app.use(function(_req, res){
    res.status(404).render("not-found");
});

app.listen(PORT, function(){
    console.log(`Rodando em http://localhost:${PORT}`);
});