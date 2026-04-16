require("dotenv").config();

const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const router = require("./routes/usuarios.routes");

console.log({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
});

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

const publicPath = path.join(__dirname, "..", "public");
const pagesPath = path.join(publicPath, "pages");
const assetsPath = path.join(publicPath, "assets");

app.use("/", express.static(pagesPath));
app.use("/assets", express.static(assetsPath));

app.use("/api", router);

app.use(function(_req,res){
    res.redirect("not-found.html")
});

app.listen(PORT, function(){
    console.log(`Rodando em http://localhost:${PORT}`);
});