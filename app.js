const express = require("express")
const { engine } = require("express-handlebars")
const mongoose = require("mongoose")
const path = require("path")
const session = require("express-session")
const flash = require("connect-flash")
const notes = require("./routes/note")
const app = express()
const bcrypt = require('bcryptjs')
const passport = require("passport")
const users = require("./routes/user")

require("./config/auth")(passport)

// Config
    app.use(express.static("public"))
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    
    app.use(session({
        secret: "anything",
        resave: true,
        saveUninitialized: true
    }))

    app.use(passport.initialize())
    app.use(passport.session())

    app.use(flash())
    
    // Template Engine Handlebars
        app.set("view engine", "handlebars")
        app.engine("handlebars", engine({defaultLayout: "main",
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
          }})) // Usa o handlebars com o template engine

    // Middleware
    app.use((req, res, next) => {
        res.locals.success_msg  = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null // O req.user é o usuário logado do passport

        next()

    })



// Mongoose
    mongoose.Promise = global.Promise
    mongoose.connect("mongodb://localhost/missions").then(() => {
        console.log("Conectado ao MongoDB")
    }).catch(err => {
        console.log("Erro ao se conectar ao MongoDB: " + err)
    })

// Public
    app.use(express.static(path.join(__dirname, "public"))) // pega o diretório para a pasta "public"



// Routes
    app.get('/', (req, res) => {
        res.redirect("/notes")
       /*  res.render("home/principal") */
    })

    app.use("/notes", notes)
    app.use("/user", users)

const port = 5000
app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`)
})