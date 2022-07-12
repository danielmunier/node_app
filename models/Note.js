const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Notes = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})


mongoose.model("notes", Notes)
