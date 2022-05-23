const express = require("express");
const handlebars = require('express-handlebars')
const Sequelize = require("sequelize");
const res = require("express/lib/response");
const User = require("./models/User");
const app = express();

const {
    randomUUID
} = require("crypto")

const {
    format
} = require("path");

const {
    brotliDecompressSync
} = require("zlib");



app.use(express.json())
// Config
    // Template Engine
    app.engine("handlebars", handlebars.engine({
        defaultLayout: 'main',
    
    }))
    app.set("view engine", "handlebars")

    // Body Express Parser
    app.use(express.urlencoded({
        extended: false
    }))
    app.use(express.json())
  



app.get("/", function(request, response){
    User.findAll({order: [["id", "DESC"]]}).then(function(users){ // Recebe o array do banco de dados 
        response.render("home", {users: users})
    })
    
})


  

app.get("/cadastro", function(request, response) {
    response.render("form")
})

app.post("/cadastrado", function(request, response) { // Rota POST recebe dados do formulário
    console.log("Iniciando o envio para o banco de dados...")
    User.create({
        email: request.body.email,
        password: request.body.password
    }).then(function(){
        console.log("Conectado com sucesso!")
        response.redirect("/")
    }).catch(function(error){
        console.log("Falha na conexão")
        console.log(error)
    })
})

app.get("/delete/:id", function(request, response){
    User.destroy({where: {'id': request.params.id}}).then(function(){
        console.log("Deletado com sucesso " + request.params.id)
        response.redirect('/')
    }).catch(function(error){
        console.log("Postagem inexistente: " + error)
    })
})



app.listen(3333, () => {
    console.clear()
    console.log(`Servidor rodando em http://localhost:3333`)
})

/* Body => Sempre que quiser enviar dados pra aplicação 
  Params => /products/:id, o id é o parametro obrigatório da rota products
  Query => /products?id=123&value=1234
*/
