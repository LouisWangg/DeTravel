module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull:  false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })

    User.associate = models => {
        User.hasOne(models.Wishlist, {
            foreignKey: 'userId',
            onDelete: "cascade"
        })
    }

    return User
}