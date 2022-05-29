module.exports = {
    // port: process.env.PORT || 8081,
    db: {
        options: {
            host: 'us-cdbr-east-05.cleardb.net',
            port: '3306',
            database: 'heroku_fc1beaaf21c5a8c',
            dialect: 'mysql',
            username: 'b3aba3b2122df0',
            password: '3abb592a'
        }
    },
    authentication: {
        jwtSecret: process.env.JWT_SECRET || 'secret'                
    }
}
