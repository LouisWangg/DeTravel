module.exports = (sequelize, DataTypes) => {
    const Wishlist = sequelize.define('Wishlist', {})

    Wishlist.associate = models => {
        Wishlist.belongsTo(models.Place, {
            foreignKey: 'placeId',
            onDelete: "cascade"
        }),
        Wishlist.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: "cascade"
        })
    }

    return Wishlist
}