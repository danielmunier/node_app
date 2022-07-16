const express = require("express")
const router = express.Router()

const io = require("socket.io")


router.get("/", (req, res) => {
    res.render("socket/index")
})