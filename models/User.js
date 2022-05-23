const db  = require("./db")


const User = db.sequelize.define("users", {
    email: {
        type: db.Sequelize.STRING(60)
    },
    password: {
        type: db.Sequelize.CHAR(60)
    }
})


/* User.sync({force: true}); ATENÇÃO: EXECUTAR APENAS UMA VEZ PARA CRIAR A TABELA "User" */ 

module.exports = User