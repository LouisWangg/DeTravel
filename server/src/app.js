const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const {sequelize} = require('./models')
const config = require('./config/config')

const app = express()
app.use(morgan('combined'))
app.use(express.json()) // bodyParser diganti sm express karena di express ver 4.16+, bodyParser uda masuk ke bagian express
app.use(cors())

// end-point for Register
require('./routes') (app)

sequelize.sync()
    .then(() => {
        app.listen(config.port)
        console.log(`Server stared on port ${config.port}`)
    })
