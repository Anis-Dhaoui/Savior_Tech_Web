module.exports = (sequelize, DataTypes) => {
    const Publications = sequelize.define(
        'Publications',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            titre: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING, allowNull: false
            },
            image: {
                type: DataTypes.STRING,
            },
            statut: {
                type: DataTypes.STRING, allowNull: false
            }


        }
    );
    Publications.associate = models => {
        Publications.hasMany(models.Commentaires, { onDelete: "cascade" })
        Publications.hasMany(models.Reactions, { onDelete: "cascade" })
        Publications.hasMany(models.Signaler, { onDelete: "cascade" })
        Publications.belongsTo(models.Users, { onDelete: "cascade" })

    }


    return Publications;
}