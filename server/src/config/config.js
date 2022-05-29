module.exports = {
    db: {
        options: {
            host: 'us-cdbr-east-05.cleardb.net',
            database: 'heroku_fc1beaaf21c5a8c?',
            dialect: 'mysql',
            user: 'b3aba3b2122df0',
            password: '3abb592a'
        }
    },
    authentication: {
        jwtSecret: process.env.JWT_SECRET || 'secret'                
    }
}
