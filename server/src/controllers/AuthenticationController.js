const {User} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const bcrypt = require('bcryptjs')

function jwtSignUser (user) { // to sign using a user object and give back a JWT token
    const ONE_WEEK = 60 * 60 * 24 * 7
    return jwt.sign(user, config.authentication.jwtSecret, {
        expiresIn: ONE_WEEK
    })
}

module.exports = {
    async register (req, res) {
        try {
            const {email, password, name} = req.body
            const user = await User.create({
                email: email,
                password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
                name: name
            })
            const userJson = user.toJSON()
            res.send({user: userJson, token: jwtSignUser(userJson)})
        } catch (error) {
            res.status(400).send({ 
                error: 'Akun email telah dipakai, harap mencoba yang lain!'
            })
        }
    },
    async login (req, res) {
        try {
            const {email, password} = req.body
            const user = await User.findOne({
                where: {
                    email: email
                }
            })
            const userJson = user.toJSON()
            const isPasswordValid = bcrypt.compareSync(password, userJson.password)

            if (!user || !isPasswordValid) {
                return res.status(403).send({
                    error: 'Email atau password yang dimasukkan salah!'
                })
            }
            res.send({ user: userJson, token: jwtSignUser(userJson)})
        } catch (error) {
            res.status(500).send({
                error: 'Email dan password tidak terdaftar dalam aplikasi!'
            })
        }
    },
}
