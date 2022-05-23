const Sequelize = require("sequelize")
require("dotenv").config()

// Conexão com o banco de dados MySQL usando o sequelize
const sequelize = new Sequelize(`${process.env.DB_NAME}`, `${process.env.DB_USER}`, `${process.env.DB_PASS}`, {
        host: "localhost",
        dialect: "mysql",
        query: {raw:true}
}) 


module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}