const Joi = require('joi')

module.exports = {
    register (req, res, next) {
        const schema = Joi.object({
            email: Joi.string().email(),
            password: Joi.string().regex(
                new RegExp('^[a-zA-Z0-9]{8,32}$')
            ),
            name: Joi.string(),
        })

        const {error} = schema.validate(req.body)

        if (error) {
            switch (error.details[0].context.key) {
                case 'email' :
                    res.status(400).send({
                        error: 'Masukkan alamat email yang tepat!'
                    })
                    break

                case 'password' :
                    res.status(400).send({
                        error: `Kata kunci yang dimasukkan tidak sesuai dengan aturan berikut : 
                            <br>
                            1. Hanya dapat memuat karakter : huruf kecil, huruf besar, dan angka.
                            <br>
                            2. Harus memiliki panjang dengan minimum 8 dan maksimum 32 karakter.
                        `
                    })
                    break

                case 'name' :
                    res.status(400).send({
                        error: 'Kolom nama belum dimasukkan!'
                    })
                    break

                default :
                    res.status(400).send({
                        error: 'Informasi registrasi tidak dapat digunakan!'
                    })
            }
        } else {
            next()
        }
    },
}
