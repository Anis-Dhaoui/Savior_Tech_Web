module.exports = (sequelize, DataTypes) => {
    const reponses = sequelize.define(
        'reponses', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            message: {
                type: DataTypes.STRING,
                allowNull: false
            },
            nbLike: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            nbDisLike: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            }

        }
    );
    reponses.associate = models => {
        reponses.belongsTo(models.questions, { onDelete: "cascade" })
        reponses.belongsTo(models.Users, { onDelete: "cascade" })

    }
    return reponses;
}