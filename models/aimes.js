module.exports = (sequelize, DataTypes) => {
    const aimes = sequelize.define(
        'aimes', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
        }
    );
    aimes.associate = models => {
        aimes.belongsTo(models.questions, { onDelete: "cascade" })
        aimes.belongsTo(models.Users, { onDelete: "cascade" })

    }
    return aimes;
}