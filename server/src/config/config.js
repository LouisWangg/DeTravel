module.exports = {
    // port: process.env.PORT || 8081,
    db: {
        options: {
            host: 'us-cdbr-east-05.cleardb.net',
            port: '3306',
            database: 'heroku_eabb5d1bb1dca5a',
            dialect: 'mysql',
            username: 'bd1a379f817dc8',
            password: '0048cdad'
        }
    },
    authentication: {
        jwtSecret: process.env.JWT_SECRET || 'secret'                
    }
}
