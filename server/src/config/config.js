module.exports = {
    port: process.env.PORT || 8081,
    db: {
        options: {
            host: 'localhost',
            port: '3306',
            database: 'geolocation',
            dialect: 'mysql',
            username: 'root',
            password: ''
        }
    },
    authentication: {
        jwtSecret: process.env.JWT_SECRET || 'secret'                
    }
}
