module.exports = (sequelize, DataTypes) => {
    const Place = sequelize.define('Place', {
        placeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        desc: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        latitude: {
            type: DataTypes.DECIMAL(10,7),
            allowNull: false
        },
        longitude: {
            type: DataTypes.DECIMAL(10,7),
            allowNull: false
        },
        entryFee: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    Place.associate = models => {
        Place.hasOne(models.Wishlist, {
            foreignKey: 'placeId',
            onDelete: "cascade"
        })
    }

    return Place
}