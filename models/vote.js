module.exports = (sequelize, DataTypes) => {
    const vote = sequelize.define(
        'vote', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            vote: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }
    );
    vote.associate = models => {
        vote.belongsTo(models.reponses, { onDelete: "cascade" })
        vote.belongsTo(models.Users, { onDelete: "cascade" })

    }
    return vote;
}