module.exports = (sequelize, DataTypes) => {
    const Reviews = sequelize.define('Reviews', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rating: {
            type: DataTypes.STRING,
        }
    });
    Reviews.associate = models => {
        Reviews.belongsTo(models.Users, {Delete: "cascade" })
        Reviews.belongsTo(models.Events, {Delete: "cascade"})
    }

    return Reviews;
}

