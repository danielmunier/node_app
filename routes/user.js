const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/User")
const User = mongoose.model("users")
const bcrypt = require("bcryptjs")
const passport = require('passport')

router.get("/register", (req, res) => {
    res.render("users/register")
})

router.get("/login", (req, res) => {
    res.render("users/login")
})

router.post("/register", (req, res) => { //Recebe os dados do front para cadastrar o usuário
    var errors = []
    console.log(req.body)

    if (!req.body.nickname || typeof req.body.nickname == undefined || req.body.nickname == null || req.body.nickname == "") {
        errors.push({
            text: "Please enter a valid name"
        })
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null || req.body.email == "") {
        errors.push({
            text: "Please enter a valid email"
        })
    }

    if (!req.body.password || typeof req.body.password == undefined || req.body.password == null || req.body.password == "") {
        errors.push({
            text: "Please enter a valid password"
        })
    }

    if (req.body.password.length < 4) {
        errors.push({
            text: "Password must be at least 4 characters"
        })
    }

    if (errors.length > 0) {
        res.render("user/register", {
            errors: errors
        })
    } else {

        User.findOne({
            email: req.body.email
        }).then((user) => {
            if (user) {
                console.log("Email já registrado")
                req.flash("error_msg", "Email already registered")
                res.redirect("/user/register")
            } else {
                const newUser = new User({
                    nickname: req.body.nickname,
                    email: req.body.email,
                    password: req.body.password

                })
                console.log("atualizou")

                bcrypt.genSalt(10, (err, salt) => { //Salt irá gerar um hash aleatório para a password
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            req.flash("error_msg", "Error registering user")
                        } else {
                            newUser.password = hash
                            console.log(newUser.password)

                            newUser.save().then(() => {
                                console.log(newUser)
                                req.flash("success_msg", "User registered successfully")
                                res.redirect("/user/login")
                            }).catch((err) => {
                                req.flash("error_msg", "Error registering user")
                                res.redirect("/user/register")
                            })
                        }
                    })
                })


            }
        })
    }
})

router.post("/login", (req, res, next) => { // Recebe os dados do front para logar o usuário
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/user/login",
        failureFlash: true
    })(req, res, next)

    
})

router.get("/delete_all", (req, res) => {
    User.deleteMany({}).then(() => {
        req.flash("success_msg", "Anotações deletadas com sucesso!")
        console.log("Users deleted")
        res.redirect("/user")

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar as anotações")
        res.send("error: " + err)
    })
})


module.exports = router