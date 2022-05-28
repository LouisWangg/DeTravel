const fs = require('fs') //to read through the file system
const path = require('path') //to deal with absolute, relative, or other paths
const Sequelize = require('sequelize') //to make a sequelize object that will later connect to the db
const config = require('../config/config')
const db = {}

const sequelize = new Sequelize(config.db.options)

fs
    .readdirSync(__dirname)
    .filter((file) =>
        file !== 'index.js'
    )
    .forEach((file) => {
        const model = sequelize.import(path.join(__dirname, file))
        db[model.name] = model
    })

    fs
    .readdirSync(__dirname)
    .filter((file) =>
        file !== 'index.js'
    )
    .forEach((file) => {
        const model = sequelize.import(path.join(__dirname, file))

        if (db[model.name].associate) {
            db[model.name].associate(db)
        }
    })

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
