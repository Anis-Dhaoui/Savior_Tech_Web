module.exports = (sequelize, DataTypes) => {
    const Signaler = sequelize.define(
        'Signaler',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            statut: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }
    );
    Signaler.associate = models => {
        Signaler.belongsTo(models.Users, { onDelete: "cascade" })
        Signaler.belongsTo(models.Publications,{onDelete:"cascade"})
    }


    return Signaler;
}