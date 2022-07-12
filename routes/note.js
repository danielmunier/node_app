const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Note")
const Note = mongoose.model("notes")


router.get("/", (req, res) => {
    Note.find().then((notes) => {
        res.render("notes/index", {
            notes: notes.map(notes => notes.toJSON())
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias!")
        res.redirect("/notes")
    })
})

router.get("/add", (req, res) => {
    res.render("notes/addnote")
})


router.get("/novo", (req, res) => {
    res.render("notes/newnote")
})

router.post("/new", (req, res) => {

    var erros = []
    if (!req.body.description && typeof req.body.description == undefined || !req.body.description == null) {
        erros.push({
            text: "Invalid description!"
        })
    }
    if (!req.body.title && typeof req.body.title == undefined || !req.body.title == null) {
        erros.push({
            text: "Invalid title!"
        })
    }

    if (req.body.description.length < 2) {
        erros.push({
            text: "Categoria muito pequena!"
        })
    }

    if (erros.length > 0) {
        res.render("notes/addnote", {
            erros: erros
        })
    } else {

        const newNote = {
            title: req.body.title,
            description: req.body.description,
            date: Date.now()
        }


        console.log(newNote)
        new Note(newNote).save().then(() => {
            req.flash("success_msg", "Nota criada com sucesso!")
            res.redirect("/notes")

        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao criar a categoria.")
            res.send("Erro: " + err)
        })
    }

})

// rota pra deletar
router.get("/delete/:id", (req, res) => {
    Note.deleteOne({
        _id: req.params.id
    }).then(() => {
        req.flash("success_msg", "Nota deletada com sucesso!")
        res.redirect("/notes")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a categoria.")
        res.send("Erro: " + err)
    })

})

// rota pra editar
router.get("/edit/:id", (req, res) => {
    Note.findOne({
        _id: req.params.id
    }).lean().then((note) => {

        res.render("notes/editnote", {
            note: note
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar a categoria.")
        res.send("Erro: " + err)
    })
})

// rota pra receber edição
router.post("/edit", (req, res) => {
    /*     console.log(req.body)
        res.redirect("/notes") */
    Note.findByIdAndUpdate({
        _id: req.body.id
    }, {
        title: req.body.title,
        description: req.body.description
    }).then(() => {
        req.flash("success_msg", "Nota editada com sucesso!")
        res.redirect("/notes")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar a categoria.")
        res.send("Erro: " + err)
    })
})

router.get("/delete_all", (req, res) => {
    Usser.deleteMany({}).then(() => {
        req.flash("success_msg", "Anotações deletadas com sucesso!")
        console.log("Note deleted")
        res.redirect("/notes")

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar as anotações")
        res.send("error: " + err)
    })
})



module.exports = router